"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GripVertical, X, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from "lucide-react"
import type { CardData } from "@/app/page"
import { RichTextEditor } from "@/components/rich-text-editor"

interface DraggableCardProps {
  card: CardData
  onUpdate: (updates: Partial<CardData>) => void
  onRemove: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
}

const colorMap = {
  rosso: "bg-red-100 border-red-300",
  giallo: "bg-yellow-100 border-yellow-300",
  blu: "bg-blue-100 border-blue-300",
  verde: "bg-green-100 border-green-300",
  bianco: "bg-white border-slate-200",
}

const colorNameItalian = {
  rosso: "Rosso",
  giallo: "Giallo",
  blu: "Blu",
  verde: "Verde",
  bianco: "Bianco",
}

const colorSwatchMap = {
  rosso: "bg-red-500",
  giallo: "bg-yellow-500",
  blu: "bg-blue-500",
  verde: "bg-green-500",
  bianco: "bg-white border-2 border-slate-300",
}

export function DraggableCard({
  card,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
}: DraggableCardProps) {
  const printHeader = `${colorNameItalian[card.color as keyof typeof colorNameItalian]} - ${card.patientName} - ${card.patology} - ${card.location} - ${card.moved} - ${card.movedTo}`

  return (
    <div className="relative">
      <div className="hidden print:block print-header">{printHeader}</div>

      <Card className={`${colorMap[card.color]} transition-colors border-2 print-card py-2 !bg-opacity-100`}>
        <CardContent className="pt-2 print-content px-2">
          <div className="flex items-center gap-2 mb-0.5 print:hidden">
            <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-black/5 rounded text-slate-700">
              <GripVertical className="w-5 h-5" />
            </div>

            <div className="flex flex-col gap-0.5">
              <Button
                onClick={onMoveUp}
                disabled={!canMoveUp}
                variant="ghost"
                size="icon"
                className="h-4 w-6 text-slate-700 hover:bg-slate-200 disabled:opacity-30 p-0"
              >
                <ArrowUp className="w-3 h-3" />
              </Button>
              <Button
                onClick={onMoveDown}
                disabled={!canMoveDown}
                variant="ghost"
                size="icon"
                className="h-4 w-6 text-slate-700 hover:bg-slate-200 disabled:opacity-30 p-0"
              >
                <ArrowDown className="w-3 h-3" />
              </Button>
            </div>

            <Select value={card.color} onValueChange={(value) => onUpdate({ color: value as CardData["color"] })}>
              <SelectTrigger className="w-32 h-8 !bg-white border-slate-300 text-black">
                <SelectValue className="flex items-center justify-center">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap[card.color]}`} />
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 text-black">
                <SelectItem value="rosso" className="flex items-center justify-center text-black">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap.rosso}`} />
                </SelectItem>
                <SelectItem value="giallo" className="flex items-center justify-center text-black">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap.giallo}`} />
                </SelectItem>
                <SelectItem value="blu" className="flex items-center justify-center text-black">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap.blu}`} />
                </SelectItem>
                <SelectItem value="verde" className="flex items-center justify-center text-black">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap.verde}`} />
                </SelectItem>
                <SelectItem value="bianco" className="flex items-center justify-center text-black">
                  <div className={`w-10 h-5 rounded ${colorSwatchMap.bianco}`} />
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Paziente"
              value={card.patientName}
              onChange={(e) => onUpdate({ patientName: e.target.value })}
              className="h-8 font-bold !bg-white border-slate-300 text-black placeholder:text-slate-400"
            />

            <Input
              placeholder="Patologia"
              value={card.patology}
              onChange={(e) => onUpdate({ patology: e.target.value })}
              className="h-8 !bg-white border-slate-300 text-black placeholder:text-slate-400"
            />

            <Select
              value={card.location}
              onValueChange={(value) => onUpdate({ location: value as CardData["location"] })}
            >
              <SelectTrigger className="w-24 h-8 !bg-white border-slate-300 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 text-black">
                <SelectItem value="empty" className="text-black">
                  -
                </SelectItem>
                <SelectItem value="OT1" className="text-black">
                  OT1
                </SelectItem>
                <SelectItem value="OT2" className="text-black">
                  OT2
                </SelectItem>
                <SelectItem value="COR" className="text-black">
                  COR
                </SelectItem>
                <SelectItem value="ACQ" className="text-black">
                  ACQ
                </SelectItem>
                <SelectItem value="TRI" className="text-black">
                  TRI
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={card.moved} onValueChange={(value) => onUpdate({ moved: value as CardData["moved"] })}>
              <SelectTrigger className="w-20 h-8 !bg-white border-slate-300 text-black">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-300 text-black">
                <SelectItem value="empty" className="text-black">
                  -
                </SelectItem>
                <SelectItem value="R" className="text-black">
                  R
                </SelectItem>
                <SelectItem value="D" className="text-black">
                  D
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              placeholder="Dove..."
              value={card.movedTo}
              onChange={(e) => onUpdate({ movedTo: e.target.value })}
              className="h-8 w-32 !bg-white border-slate-300 text-black placeholder:text-slate-400"
            />

            <Button
              onClick={() => onUpdate({ collapsed: !card.collapsed })}
              variant="ghost"
              size="icon"
              className="h-8 w-8 ml-auto text-slate-700 hover:bg-slate-200"
            >
              {card.collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </Button>

            <Button
              onClick={onRemove}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-700 hover:bg-slate-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {!card.collapsed && (
            <RichTextEditor value={card.content} onChange={(value) => onUpdate({ content: value })} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
