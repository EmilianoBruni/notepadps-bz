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
    } catch (e) {
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
    } catch (e) {
        alert('JSON non valido');
        return null;
    }
}

/**
 * Imports cards from clipboard text, creating one card per non-empty line
 */
export async function importCardsFromClipboard(): Promise<CardData[] | null> {
    try {
        const text = await navigator.clipboard.readText();
        // Each non-empty line becomes a basic card
        const lines = text
            .split(/\r?\n/)
            .map(l => l.trim())
            .filter(Boolean);
        if (lines.length === 0) {
            alert('Appunti vuoti o non parsabili');
            return null;
        }
        const newCards = lines.map(line => {
            const base = createDefaultCard();
            return {
                ...base,
                patientName: line,
                patology: '',
                content: line
            } as CardData;
        });
        return newCards;
    } catch (e) {
        alert('Impossibile leggere dagli appunti');
        return null;
    }
}
