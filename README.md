# ERFlow

A modern web application for managing patient flow and case management in healthcare settings.

Your patient information is saved automatically in browser LocalStorage. **NO data is sent in INTERNET to external servers**

The application is available at https://emilianobruni.github.io/erflow

## Features

-   **Rich Text Editor**: Create and format detailed patient notes with bold, strikethrough, lists, and color formatting
-   **Drag & Drop Interface**: Easily reorder patient cards with intuitive drag-and-drop functionality
-   **Color-Coded Cards**: Organize patients by status with visual color indicators (Red, Yellow, Blue, Green, White)
-   **Location Tracking**: Assign patients to specific areas (OBI1, OBI2, OBI3, OT1, OT2, COR, ACQ, TRI)
-   **Movement Tracking**: Track patient movements and destinations
-   **Print Support**: Generate clean, formatted printouts of patient information
-   **Responsive Design**: Optimized layouts for desktop and tablet devices
-   **Auto-expanding Editor**: Text editor automatically adjusts height based on content
-   **Local Storage**: All patient data is automatically saved locally in your browser

### Data Storage

ERFlow uses **browser LocalStorage** to persist all data locally on your device. This means:

-   Your patient information is saved automatically as you make changes
-   **No data is sent to external servers**
-   Data persists between browser sessions
-   Clearing your browser cache will remove all saved data

LocalStorage is a browser feature that allows web applications to store up to ~10MB of data directly on your computer.

## Keyboard Shortcuts

| Shortcut                                        | Action                         |
| ----------------------------------------------- | ------------------------------ |
| <kbd>Crtl</kbd> + <kbd>Alt</kbd> + <kbd>P</kbd> | Add new card                   |
| <kbd>Crtl</kbd> + <kbd>Alt</kbd> + <kbd>C</kbd> | Collapse all cards             |
| <kbd>Crtl</kbd> + <kbd>Alt</kbd> + <kbd>U</kbd> | Expand all cards               |
| <kbd>Crtl</kbd> + <kbd>Alt</kbd> + <kbd>B</kbd> | Bold text (in editor)          |
| <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> | Strikethrough text (in editor) |

## Technology Stack

-   **Frontend**: React 18 with TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: Custom components with Lucide icons
-   **Editor**: Browser's native contentEditable API with `document.execCommand`
-   **Build**: Next.js with App Router

## Usage

### Managing Patients

1. **Create Cards**: Add new patient cards with basic information
2. **Edit Details**: Update patient name, pathology, location, and movement status
3. **Add Notes**: Use the rich text editor to add detailed clinical notes
4. **Organize**: Drag cards to reorder, use arrow buttons for fine control
5. **Track Movement**: Mark patients as moved (R/D) and specify destination

### Printing

-   Click the print button to generate a formatted report
-   All cards will display with their information in a clean layout
-   Editor automatically disables auto-height adjustment during print mode

## Component Structure

-   **RichTextEditor**: WYSIWYG editor with formatting toolbar
-   **DraggableCard**: Main card component with patient information and controls
-   **UI Components**: Button, Input, Select, Card components from shadcn/ui

## Color Coding

-   **Rosso (Red)**: Urgent/High Priority
-   **Giallo (Yellow)**: Warning/Medium Priority
-   **Blu (Blue)**: Standard/Normal
-   **Verde (Green)**: Stable/Low Priority
-   **Bianco (White)**: Neutral/Discharged

## Browser Support

-   Chrome/Chromium (latest)
-   Firefox (latest)
-   Safari (latest)
-   Edge (latest)

## Getting Started

This is only if you wish to have this app hosted in your webspace/domain.

### Prerequisites

-   Node.js (pre-installed in dev container)
-   pnpm (pre-installed in dev container)

### Installation

```bash
pnpm install
```

### Development

```bash
pnpm dev
```

### Build

```bash
pnpm build
```

### Linting

```bash
pnpm lint
```

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

### Summary

ERFlow is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

ERFlow is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with ERFlow. If not, see <https://www.gnu.org/licenses/>.
