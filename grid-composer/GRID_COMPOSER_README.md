# Grid Composer - Interactive Table Builder for Sitecore XM Cloud

Grid Composer is a custom field integration for Sitecore XM Cloud that provides content authors with a powerful, visual interface for creating and editing tables. Tables are stored as clean, structured JSON and can be easily consumed by front-end rendering components.

## Features

### Table Building
- **Visual Table Editor**: Intuitive interface for creating and editing tables
- **Dynamic Rows & Columns**: Add, remove, insert, and reorder rows and columns
- **Inline Cell Editing**: Click any cell to edit content directly
- **Header Row Support**: Toggle rows as headers for semantic table structure

### Cell Formatting
- **Text Alignment**: Left, center, right alignment options
- **Vertical Alignment**: Top, middle, bottom alignment
- **Font Weight**: Normal, medium, semibold, and bold text options
- **Cell Selection**: Visual feedback showing which cell is selected for formatting

### Data Management
- **JSON Storage**: Clean, structured JSON format stored in Sitecore fields
- **Auto-save Detection**: Tracks changes and indicates unsaved modifications
- **Validation**: Data structure validation before saving
- **Error Handling**: Graceful error handling with user-friendly messages

### User Experience
- **Responsive Design**: Works seamlessly in the Sitecore field editor context
- **Loading States**: Clear feedback during data loading and saving
- **Success/Error Messages**: Visual alerts for save operations
- **Undo Changes**: Cancel button to revert unsaved modifications

## Project Structure

```
grid-composer/
├── app/
│   ├── layout.tsx           # Root layout with MarketplaceProvider
│   └── page.tsx             # Main page rendering Grid Composer
├── components/
│   ├── grid-composer/
│   │   ├── grid-composer.tsx          # Main custom field component (SDK integration)
│   │   ├── table-builder.tsx        # Interactive table editor UI
│   │   ├── editable-cell.tsx        # Inline cell editing component
│   │   └── cell-format-toolbar.tsx  # Cell formatting controls
│   ├── providers/
│   │   └── marketplace.tsx          # Sitecore Marketplace SDK provider
│   └── ui/                          # Blok/shadcn UI components
├── lib/
│   └── types/
│       └── table.ts                 # Table data structure & utilities
└── package.json
```

## Table Data Structure

Grid Composer stores table data in a clean, versioned JSON format:

```typescript
{
  "version": "1.0",
  "rows": [
    {
      "id": "unique-row-id",
      "isHeader": true,
      "cells": [
        {
          "id": "unique-cell-id",
          "content": "Header Cell",
          "format": {
            "align": "left",
            "verticalAlign": "middle",
            "fontWeight": "bold",
            "wrap": true
          }
        }
      ]
    }
  ],
  "columns": [
    {
      "id": "unique-column-id",
      "label": "Column 1",
      "width": "auto"
    }
  ],
  "settings": {
    "hasHeaderRow": true,
    "hasBorders": true,
    "isStriped": false,
    "defaultCellFormat": { ... }
  },
  "metadata": {
    "created": "2025-01-15T10:00:00.000Z",
    "modified": "2025-01-15T11:30:00.000Z"
  }
}
```

## Installation & Setup

### Prerequisites
- Node.js 16 or later
- npm 10 or later
- Access to Sitecore Cloud Portal
- XM Cloud subscription

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

The app will run on `http://localhost:3000` in development mode.

### Build for Production
```bash
npm run build
npm start
```

## Sitecore Integration

### Extension Point Configuration

Grid Composer is configured as a **custom field integration** using the extension point:

```typescript
xmcPagesCustomField = 'xmc:pages:customfield'
```

### Marketplace SDK Integration

The app uses the Sitecore Marketplace SDK for:

1. **Initialization**: Secure handshake with Sitecore XM Cloud
2. **getValue()**: Loading existing table data from the field
3. **setValue()**: Saving updated table data back to the field
4. **Error Handling**: Graceful fallback for invalid or missing data

### Field Configuration in Sitecore

When configuring Grid Composer as a custom field in Sitecore:

1. Install the Grid Composer app from the Sitecore Marketplace
2. Create a new field or update an existing field to use Grid Composer
3. Set the field type to use the Grid Composer custom field integration
4. The field should store JSON data (text/string field)

## How It Works

### Loading Data
1. Grid Composer component mounts in the Sitecore field editor
2. SDK establishes secure connection with Sitecore
3. `client.getValue()` retrieves current field value
4. JSON data is parsed and validated
5. If no data exists or data is invalid, creates a new 3×3 table

### Editing Tables
1. User interacts with table (add/remove rows/columns, edit cells, etc.)
2. Changes update local React state
3. Dirty state tracking indicates unsaved changes
4. Cell formatting toolbar appears when a cell is selected

### Saving Data
1. User clicks "Save" button
2. Table data is validated
3. Data is serialized to JSON with updated timestamp
4. `client.setValue(jsonData, true)` saves to Sitecore field
5. Canvas reloads to reflect changes
6. Success message confirms save operation

## Key Components

### Grid Composer (`grid-composer.tsx`)
- Main custom field component
- SDK integration (getValue/setValue)
- Loading, error, and success states
- Save/Cancel actions with dirty state tracking

### TableBuilder (`table-builder.tsx`)
- Interactive table editing UI
- Row/column operations (add, remove, insert, move)
- Cell selection and formatting
- Header row toggle

### EditableCell (`editable-cell.tsx`)
- Inline cell editing
- Click to edit, Enter to save, Escape to cancel
- Cell formatting application (alignment, font weight, colors)

### CellFormatToolbar (`cell-format-toolbar.tsx`)
- Visual formatting controls
- Horizontal alignment (left, center, right)
- Vertical alignment (top, middle, bottom)
- Font weight (normal, medium, semibold, bold)

## Consuming Table Data

Front-end components can easily consume the Grid Composer JSON data:

```typescript
import { TableData, parseTableData } from '@/lib/types/table';

// Parse field value
const tableData = parseTableData(fieldValue);

// Render table
<table>
  {tableData.rows.map(row => (
    <tr key={row.id}>
      {row.cells.map(cell => (
        <td
          key={cell.id}
          style={{
            textAlign: cell.format?.align,
            fontWeight: cell.format?.fontWeight,
            ...
          }}
        >
          {cell.content}
        </td>
      ))}
    </tr>
  ))}
</table>
```

## Best Practices

1. **Always Validate Data**: Use `validateTableData()` before saving
2. **Handle Errors Gracefully**: Provide fallbacks for invalid data
3. **Update Metadata**: Modified timestamp is automatically updated on save
4. **Test in Sitecore**: Always test the integration in actual XM Cloud environment
5. **Mobile Considerations**: Table editor works best on desktop/tablet screens

## Troubleshooting

### "Failed to load table data"
- Ensure the app is loaded inside Sitecore XM Cloud
- Check browser console for SDK initialization errors
- Verify extension point configuration in Sitecore

### "Invalid table data structure"
- Existing field data may be corrupted or in wrong format
- Grid Composer will create a new empty table automatically
- Check data validation logic in `lib/types/table.ts`

### Changes not saving
- Verify SDK connection is established
- Check browser console for `setValue()` errors
- Ensure proper permissions in Sitecore

## Development Notes

### Dependencies
- **@sitecore-marketplace-sdk/client**: Core SDK for marketplace apps
- **@sitecore-marketplace-sdk/xmc**: XM Cloud specific integrations
- **Next.js 15**: React framework
- **Tailwind CSS 4**: Styling
- **Radix UI**: Accessible UI primitives
- **lucide-react**: Icon library

### UI Components
The app uses Blok design system (based on shadcn/ui) for consistent Sitecore experience.

### TypeScript
Fully typed with comprehensive interfaces for type safety.

## Future Enhancements

Potential features for future versions:
- CSV import/export
- Table templates
- Advanced cell formatting (colors, borders)
- Cell merging/spanning
- Formula support
- Sorting and filtering capabilities
- Responsive table preview
- Accessibility improvements

## Support

For issues, questions, or feature requests, please refer to the Sitecore Marketplace documentation or contact support.

---

**Grid Composer** - Built with ❤️ for Sitecore XM Cloud content authors
