'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bold, List, Palette, X, Strikethrough, Settings2 } from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const [selectedColor, setSelectedColor] = useState('#000000');
    const [isToolbarOpen, setIsToolbarOpen] = useState(false);

    const adjustHeight = () => {
        if (editorRef.current) {
            editorRef.current.style.height = 'auto';
            if (!window.matchMedia('print').matches) {
                editorRef.current.style.height = `${Math.max(
                    75,
                    editorRef.current.scrollHeight
                )}px`;
            }
        }
    };
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
            adjustHeight();
        }
    }, [value]);

    useEffect(() => {
        const mediaQueryList = window.matchMedia('print');
        const handleMediaChange = () => {
            adjustHeight();
        };

        mediaQueryList.addEventListener('change', handleMediaChange);
        return () => {
            mediaQueryList.removeEventListener('change', handleMediaChange);
        };
    }, []);

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
            adjustHeight();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        // Ctrl-Alt-B for bold
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            execCommand('bold');
        }
        // Ctrl-Alt-S for strikethrough
        if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 's') {
            e.preventDefault();
            execCommand('strikeThrough');
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const applyColor = () => {
        execCommand('foreColor', selectedColor);
    };

    return (
        <div>
            {isToolbarOpen && (
                <div className="border border-slate-300 rounded-lg overflow-hidden mb-1 bg-slate-50 print:hidden">
                    <div className="flex items-center gap-2 p-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-700 hover:bg-slate-200"
                            onClick={() => execCommand('bold')}
                            title="Bold"
                        >
                            <Bold className="w-4 h-4" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-700 hover:bg-slate-200"
                            onClick={() => execCommand('strikeThrough')}
                            title="Strikethrough"
                        >
                            <Strikethrough className="w-4 h-4" />
                        </Button>

                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-slate-700 hover:bg-slate-200"
                            onClick={() => execCommand('insertUnorderedList')}
                            title="Bullet List"
                        >
                            <List className="w-4 h-4" />
                        </Button>

                        <div className="flex items-center gap-1">
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={e => setSelectedColor(e.target.value)}
                                className="w-8 h-8 rounded cursor-pointer"
                                title="Choose color"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-700 hover:bg-slate-200"
                                onClick={applyColor}
                                title="Apply color"
                            >
                                <Palette className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="ml-auto flex items-center gap-1">
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-700 hover:bg-slate-200"
                                onClick={() => setIsToolbarOpen(false)}
                                title="Close"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative">
                <div
                    ref={editorRef}
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    className="min-h-[75px] p-4 bg-white border-2 border-slate-300 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y overflow-auto print:pt-1 print:pb-1 print:min-h-0!"
                    style={{
                        wordWrap: 'break-word',
                        overflowWrap: 'break-word'
                    }}
                />
                {!isToolbarOpen && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-6 w-6 opacity-50 hover:opacity-100 text-slate-600 hover:bg-slate-200"
                        onClick={() => setIsToolbarOpen(true)}
                        title="Open formatting toolbar"
                    >
                        <Settings2 className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    );
}
