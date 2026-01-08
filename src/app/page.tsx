'use client';

// Card management system with drag-and-drop support
import type React from 'react';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DraggableCard } from '@/components/draggable-card';
import { Input } from '@/components/ui/input';
import { ActionButtons } from '@/components/action-buttons';

export interface CardData {
    id: string;
    color: 'rosso' | 'giallo' | 'blu' | 'verde' | 'bianco';
    patientName: string;
    patology: string;
    location:
        | 'OT1'
        | 'OT2'
        | 'COR'
        | 'ACQ'
        | 'TRI'
        | 'empty'
        | 'OBI1'
        | 'OBI2'
        | 'OBI3';
    moved: 'R' | 'D' | 'empty';
    movedTo: string;
    content: string;
    collapsed?: boolean;
}

export default function Page() {
    const [cards, setCards] = useState<CardData[]>([]);
    const [isClient, setIsClient] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        setIsClient(true);
        const darkMode = localStorage.getItem('dark-mode') === 'true';
        setIsDark(darkMode);
        if (darkMode) {
            document.documentElement.classList.add('dark');
        }

        const saved = localStorage.getItem('draggable-cards');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCards(parsed);
            } catch (e) {
                console.error('Failed to parse saved cards:', e);
                setCards([createDefaultCard()]);
            }
        } else {
            setCards([createDefaultCard()]);
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('dark-mode', isDark.toString());
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark, isClient]);

    useEffect(() => {
        if (isClient && cards.length > 0) {
            localStorage.setItem('draggable-cards', JSON.stringify(cards));
        }
    }, [cards, isClient]);

    function createDefaultCard(): CardData {
        return {
            id: `card-${Date.now()}-${Math.random()}`,
            color: 'bianco',
            patientName: '',
            patology: '',
            location: 'empty',
            moved: 'empty',
            movedTo: '',
            content: '',
            collapsed: false
        };
    }

    function handleDragStart(index: number) {
        setDraggedIndex(index);
    }

    function handleDragOver(e: React.DragEvent, index: number) {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newCards = [...cards];
        const draggedCard = newCards[draggedIndex];
        newCards.splice(draggedIndex, 1);
        newCards.splice(index, 0, draggedCard);
        setCards(newCards);
        setDraggedIndex(index);
    }

    function handleDragEnd() {
        setDraggedIndex(null);
    }

    function addCard() {
        setCards([...cards, createDefaultCard()]);
    }

    function removeCard(id: string) {
        setCards(cards.filter(card => card.id !== id));
    }

    function updateCard(id: string, updates: Partial<CardData>) {
        setCards(
            cards.map(card => (card.id === id ? { ...card, ...updates } : card))
        );
    }

    function collapseAll() {
        setCards(cards.map(card => ({ ...card, collapsed: true })));
    }

    function expandAll() {
        setCards(cards.map(card => ({ ...card, collapsed: false })));
    }

    function deleteAll() {
        if (confirm('Sei sicuro di voler eliminare tutti i pazienti?')) {
            setCards([]);
            localStorage.removeItem('draggable-cards');
        }
    }

    function moveCardUp(id: string) {
        const index = cards.findIndex(c => c.id === id);
        if (index > 0) {
            const newCards = [...cards];
            const temp = newCards[index];
            newCards[index] = newCards[index - 1];
            newCards[index - 1] = temp;
            setCards(newCards);
        }
    }

    function moveCardDown(id: string) {
        const index = cards.findIndex(c => c.id === id);
        if (index < cards.length - 1) {
            const newCards = [...cards];
            const temp = newCards[index];
            newCards[index] = newCards[index + 1];
            newCards[index + 1] = temp;
            setCards(newCards);
        }
    }

    const filteredCards = cards.filter(card =>
        card.patientName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isClient) {
        return null;
    }

    return (
        <div
            className="min-h-screen p-6 print:bg-white print:p-0"
            style={{ backgroundColor: isDark ? 'black' : 'white' }}
        >
            <div className="max-w-full mx-auto space-y-6">
                <div className="flex items-center justify-between print:hidden gap-4">
                    <h1
                        className="text-3xl font-bold"
                        style={{ color: isDark ? 'white' : 'black' }}
                    >
                        Promemoria pazienti
                    </h1>

                    <div className="relative w-64">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Cerca per nome paziente..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="pl-10 !bg-white !text-black border-gray-300"
                            style={{
                                backgroundColor: 'white',
                                color: 'black'
                            }}
                        />
                    </div>

                    <ActionButtons
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
                        onCollapseAll={collapseAll}
                        onExpandAll={expandAll}
                        onDeleteAll={deleteAll}
                        onAddCard={addCard}
                    />
                </div>

                <div className="space-y-4">
                    {filteredCards.map((card, index) => (
                        <div
                            key={card.id}
                            data-card-index={cards.findIndex(
                                c => c.id === card.id
                            )}
                            draggable
                            onDragStart={() =>
                                handleDragStart(
                                    cards.findIndex(c => c.id === card.id)
                                )
                            }
                            onDragOver={e =>
                                handleDragOver(
                                    e,
                                    cards.findIndex(c => c.id === card.id)
                                )
                            }
                            onDragEnd={handleDragEnd}
                            className={
                                draggedIndex ===
                                cards.findIndex(c => c.id === card.id)
                                    ? 'opacity-50'
                                    : ''
                            }
                        >
                            <DraggableCard
                                card={card}
                                onUpdate={updates =>
                                    updateCard(card.id, updates)
                                }
                                onRemove={() => removeCard(card.id)}
                                onMoveUp={() => moveCardUp(card.id)}
                                onMoveDown={() => moveCardDown(card.id)}
                                canMoveUp={
                                    cards.findIndex(c => c.id === card.id) > 0
                                }
                                canMoveDown={
                                    cards.findIndex(c => c.id === card.id) <
                                    cards.length - 1
                                }
                            />
                        </div>
                    ))}
                </div>

                {filteredCards.length === 0 && cards.length > 0 && (
                    <div
                        className="text-center py-12 print:hidden"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        Nessun paziente trovato con il nome "{searchQuery}".
                    </div>
                )}

                {cards.length === 0 && (
                    <div
                        className="text-center py-12 print:hidden"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        Ancora nessun paziente. Premi su "Aggiungi paziente" per
                        crearne uno.
                    </div>
                )}

                <div className="flex items-center justify-end print:hidden">
                    <ActionButtons
                        isDark={isDark}
                        onToggleDark={() => setIsDark(!isDark)}
                        onCollapseAll={collapseAll}
                        onExpandAll={expandAll}
                        onDeleteAll={deleteAll}
                        onAddCard={addCard}
                    />
                </div>
            </div>
        </div>
    );
}
