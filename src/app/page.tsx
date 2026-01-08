'use client';

// Card management system with drag-and-drop support
import type React from 'react';

import { useState, useEffect, useRef, useCallback } from 'react';
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

export default function Page() {
    const isClientRef = useRef(false);

    // Initialize state from localStorage on first render
    const [cards, setCards] = useState<CardData[]>(() => {
        if (typeof window === 'undefined') return [];
        const saved = localStorage.getItem('draggable-cards');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse saved cards:', e);
                return [createDefaultCard()];
            }
        }
        return [createDefaultCard()];
    });

    const [isDark, setIsDark] = useState(() => {
        if (typeof window === 'undefined') return false;
        return localStorage.getItem('dark-mode') === 'true';
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const addCard = useCallback(() => {
        setCards(prevCards => [...prevCards, createDefaultCard()]);
    }, []);

    function removeCard(id: string) {
        setCards(cards.filter(card => card.id !== id));
    }

    function updateCard(id: string, updates: Partial<CardData>) {
        setCards(
            cards.map(card => (card.id === id ? { ...card, ...updates } : card))
        );
    }

    const collapseAll = useCallback(() => {
        setCards(prevCards =>
            prevCards.map(card => ({ ...card, collapsed: true }))
        );
    }, []);

    const expandAll = useCallback(() => {
        setCards(prevCards =>
            prevCards.map(card => ({ ...card, collapsed: false }))
        );
    }, []);

    useEffect(() => {
        isClientRef.current = true;
        // Apply dark mode class on mount
        if (isDark) {
            document.documentElement.classList.add('dark');
        }
    }, [isDark]);

    useEffect(() => {
        if (!isClientRef.current) return;

        function handleKeydown(e: KeyboardEvent) {
            if (!e.ctrlKey || !e.altKey) return;
            const key = e.key.toLowerCase();

            if (key === 'p') {
                e.preventDefault();
                addCard();
            } else if (key === 'c') {
                e.preventDefault();
                collapseAll();
            } else if (key === 'u') {
                e.preventDefault();
                expandAll();
            }
        }

        window.addEventListener('keydown', handleKeydown);
        return () => window.removeEventListener('keydown', handleKeydown);
    }, [addCard, collapseAll, expandAll]);

    useEffect(() => {
        if (isClientRef.current) {
            localStorage.setItem('dark-mode', isDark.toString());
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    }, [isDark]);

    useEffect(() => {
        if (isClientRef.current && cards.length > 0) {
            localStorage.setItem('draggable-cards', JSON.stringify(cards));
        }
    }, [cards]);

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
                            className="pl-10 bg-white! text-black! border-gray-300"
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
                    {filteredCards.map(card => (
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
                        Nessun paziente trovato con il nome &quot;{searchQuery}
                        &quot;.
                    </div>
                )}

                {cards.length === 0 && (
                    <div
                        className="text-center py-12 print:hidden"
                        style={{ color: isDark ? '#94a3b8' : '#64748b' }}
                    >
                        Ancora nessun paziente. Premi su &quot;Aggiungi
                        paziente&quot; per crearne uno.
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
