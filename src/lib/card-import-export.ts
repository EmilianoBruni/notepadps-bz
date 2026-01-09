import type { CardData } from '@/app/page';

/**
 * Creates a default card with empty values
 */
export function createDefaultCard(): CardData {
    return {
        id: `card-${Date.now()}-${Math.random()}`,
        color: 'bianco',
        patientName: '',
        patology: '',
        location: ' ',
        moved: ' ',
        movedTo: '',
        content: '',
        collapsed: false
    };
}

/**
 * Exports cards to a JSON file and triggers download
 */
export function exportCardsToJson(cards: CardData[]): void {
    try {
        const dataStr = JSON.stringify(cards, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const date = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `erflow-cards-${date}.json`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch {
        alert('Errore durante esportazione JSON');
    }
}

/**
 * Imports cards from a JSON string and validates the data
 */
export function importCardsFromJson(text: string): CardData[] | null {
    try {
        const parsed = JSON.parse(text);
        if (!Array.isArray(parsed)) {
            alert('Formato JSON non valido: attesa una lista di pazienti');
            return null;
        }
        const restored = parsed.map((c: Partial<CardData>) => {
            const base = createDefaultCard();
            return {
                ...base,
                ...c,
                id: typeof c.id === 'string' && c.id.trim() ? c.id : base.id,
                color:
                    c.color === 'rosso' ||
                    c.color === 'giallo' ||
                    c.color === 'blu' ||
                    c.color === 'verde' ||
                    c.color === 'bianco'
                        ? c.color
                        : base.color,
                moved:
                    c.moved === 'R' || c.moved === 'D' || c.moved === ' '
                        ? c.moved
                        : base.moved,
                location:
                    c.location === 'OT1' ||
                    c.location === 'OT2' ||
                    c.location === 'COR' ||
                    c.location === 'ACQ' ||
                    c.location === 'TRI' ||
                    c.location === 'OBI1' ||
                    c.location === 'OBI2' ||
                    c.location === 'OBI3' ||
                    c.location === ' '
                        ? (c.location as CardData['location'])
                        : base.location,
                collapsed: !!c.collapsed
            } as CardData;
        });
        return restored;
    } catch {
        alert('JSON non valido');
        return null;
    }
}

/**
 * Imports cards from clipboard text, creating one card per non-empty line
 */
export async function importCardsFromClipboard(
    text: string
): Promise<CardData[] | null> {
    try {
        const rawLines = text.split(/\r?\n/).map(l => l.trimEnd());
        // Identify entry blocks by lines starting with a triage color + patient name
        const colorLineRegex =
            /^(ROSSO|GIALLO|BLU|VERDE|BIANCO|ARANCIONE|AZZURRO)\s+(.+)$/i;

        const colorMap: Record<string, CardData['color']> = {
            ROSSO: 'rosso',
            GIALLO: 'giallo',
            BLU: 'blu',
            AZZURRO: 'blu',
            VERDE: 'verde',
            BIANCO: 'bianco',
            ARANCIONE: 'giallo'
        };

        type Entry = {
            colorWord: string;
            patientName: string;
            lines: string[];
        };
        const entries: Entry[] = [];
        let current: Entry | null = null;

        for (const lineRaw of rawLines) {
            const line = lineRaw.trim();
            const match = line.match(colorLineRegex);
            if (match) {
                // Start a new entry
                if (current) entries.push(current);
                const colorWord = match[1].toUpperCase();
                const patientName = match[2].trim();
                current = { colorWord, patientName, lines: [] };
                continue;
            }
            if (current) {
                current.lines.push(line);
            }
        }
        if (current) entries.push(current);

        if (entries.length === 0) {
            alert('Appunti vuoti o struttura non riconosciuta');
            return null;
        }

        function extractLocation(lines: string[]): CardData['location'] {
            const locMatch = lines
                .map(l =>
                    l.match(/SALA\s+(OT1|OT2|COR|ACQ|TRI|OBI1|OBI2|OBI3)\b/i)
                )
                .find(Boolean);
            if (locMatch && locMatch[1]) {
                const code = locMatch[1].toUpperCase() as CardData['location'];
                return code;
            }
            return ' ';
        }

        function extractPatology(lines: string[]): string {
            // Prefer the second column of the first tabbed line, else first descriptive non-header line
            let tabbedCandidate: string | null = null;
            for (const l of lines) {
                if (l.includes('\t')) {
                    const parts = l.split('\t').map(s => s.trim());
                    const last = parts[parts.length - 1];
                    if (last) {
                        tabbedCandidate = last;
                        break;
                    }
                }
            }

            const ignorePrefixes = [
                /^Prendi in Carico/i,
                /^Referto/i,
                /^Allergie/i,
                /^SALA\b/i,
                /^\d{2}\/\d{2}\/\d{4}/, // DOB line
                /^\d{2}\/\d{2}\s/ // time lines like 07/01 12:38
            ];

            for (const l of lines) {
                const trimmed = l.trim();
                if (!trimmed) continue;
                const isIgnored = ignorePrefixes.some(rx => rx.test(trimmed));
                if (!isIgnored) {
                    return trimmed;
                }
            }
            return tabbedCandidate ?? '';
        }

        const newCards: CardData[] = entries.map(entry => {
            const base = createDefaultCard();
            const color = colorMap[entry.colorWord] ?? 'bianco';
            const location = extractLocation(entry.lines);
            const patology = extractPatology(entry.lines);
            const content = '';

            return {
                ...base,
                color,
                patientName: entry.patientName,
                patology,
                location,
                content
            } as CardData;
        });

        return newCards;
    } catch {
        alert('Impossibile leggere dagli appunti');
        return null;
    }
}
