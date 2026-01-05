"use client"

import { useState, useEffect } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Button } from "@/components/ui/button"
import { Plus, ChevronsDown, ChevronsUp, Trash2 } from "lucide-react"
import { DraggableCard } from "@/components/draggable-card"

export interface CardData {
  id: string
  color: "rosso" | "giallo" | "blu" | "verde" | "bianco"
  textField1: string
  textField2: string
  ot: "OT1" | "OT2" | "COR" | "ACQ" | "TRI"
  rd: "R" | "D"
  textbox: string
  content: string
  collapsed?: boolean
}

export default function Page() {
  const [cards, setCards] = useState<CardData[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  useEffect(() => {
    setIsClient(true)
    const darkMode = localStorage.getItem("dark-mode") === "true"
    setIsDark(darkMode)
    if (darkMode) {
      document.documentElement.classList.add("dark")
    }

    const saved = localStorage.getItem("draggable-cards")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCards(parsed)
      } catch (e) {
        console.error("[v0] Failed to parse saved cards:", e)
        setCards([createDefaultCard()])
      }
    } else {
      setCards([createDefaultCard()])
    }
  }, [])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("dark-mode", isDark.toString())
      if (isDark) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }, [isDark, isClient])

  useEffect(() => {
    if (isClient && cards.length > 0) {
      localStorage.setItem("draggable-cards", JSON.stringify(cards))
    }
  }, [cards, isClient])

  function createDefaultCard(): CardData {
    return {
      id: `card-${Date.now()}-${Math.random()}`,
      color: "bianco",
      textField1: "",
      textField2: "",
      ot: "OT1",
      rd: "R",
      textbox: "",
      content: "",
      collapsed: false,
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  function addCard() {
    setCards([...cards, createDefaultCard()])
  }

  function removeCard(id: string) {
    setCards(cards.filter((card) => card.id !== id))
  }

  function updateCard(id: string, updates: Partial<CardData>) {
    setCards(cards.map((card) => (card.id === id ? { ...card, ...updates } : card)))
  }

  function collapseAll() {
    setCards(cards.map((card) => ({ ...card, collapsed: true })))
  }

  function expandAll() {
    setCards(cards.map((card) => ({ ...card, collapsed: false })))
  }

  function deleteAll() {
    if (confirm("Sei sicuro di voler eliminare tutti i pazienti?")) {
      setCards([])
      localStorage.removeItem("draggable-cards")
    }
  }

  if (!isClient) {
    return null
  }

  return (
    <div className="min-h-screen p-6 print:bg-white print:p-0" style={{ backgroundColor: isDark ? "black" : "white" }}>
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex items-center justify-between print:hidden">
          <h1 className="text-3xl font-bold" style={{ color: isDark ? "white" : "black" }}>
            Promemoria pazienti
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsDark(!isDark)}
              variant="outline"
              size="sm"
              className="gap-2 border"
              style={{
                backgroundColor: isDark ? "#1e293b" : "white",
                color: isDark ? "white" : "black",
                borderColor: isDark ? "#475569" : "#cbd5e1",
              }}
            >
              {isDark ? "🌙" : "☀️"}
            </Button>
            <Button
              onClick={collapseAll}
              variant="outline"
              size="sm"
              className="gap-2 border bg-transparent"
              style={{
                backgroundColor: isDark ? "#1e293b" : "white",
                color: isDark ? "white" : "black",
                borderColor: isDark ? "#475569" : "#cbd5e1",
              }}
            >
              <ChevronsUp className="w-4 h-4" />
              Collassa tutti
            </Button>
            <Button
              onClick={expandAll}
              variant="outline"
              size="sm"
              className="gap-2 border bg-transparent"
              style={{
                backgroundColor: isDark ? "#1e293b" : "white",
                color: isDark ? "white" : "black",
                borderColor: isDark ? "#475569" : "#cbd5e1",
              }}
            >
              <ChevronsDown className="w-4 h-4" />
              Espandi tutti
            </Button>
            <Button
              onClick={deleteAll}
              variant="outline"
              size="sm"
              className="gap-2 border bg-transparent"
              style={{
                backgroundColor: isDark ? "#7f1d1d" : "#fecaca",
                color: isDark ? "#fecaca" : "#7f1d1d",
                borderColor: isDark ? "#991b1b" : "#f87171",
              }}
            >
              <Trash2 className="w-4 h-4" />
              Elimina tutti
            </Button>
            <Button
              onClick={addCard}
              className="gap-2"
              style={{
                backgroundColor: isDark ? "white" : "blue",
                color: isDark ? "black" : "white",
              }}
            >
              <Plus className="w-4 h-4" />
              Aggiungi paziente
            </Button>
          </div>
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {cards.map((card) => (
                <DraggableCard
                  key={card.id}
                  card={card}
                  onUpdate={(updates) => updateCard(card.id, updates)}
                  onRemove={() => removeCard(card.id)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {cards.length === 0 && (
          <div className="text-center py-12 print:hidden" style={{ color: isDark ? "#94a3b8" : "#64748b" }}>
            Ancora nessun paziente. Premi su "Aggiungi paziente" per crearne uno.
          </div>
        )}
      </div>
    </div>
  )
}
