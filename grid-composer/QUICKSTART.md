# Grid Composer Quick Start Guide

Get Grid Composer up and running in minutes!

## What You've Built

Grid Composer is now a fully functional custom field integration for Sitecore XM Cloud with:

✅ **Interactive Table Builder**: Visual interface for creating tables
✅ **Inline Cell Editing**: Click-to-edit functionality
✅ **Row & Column Management**: Add, remove, insert, and reorder
✅ **Header Rows**: Toggle rows as headers
✅ **Cell Formatting**: Alignment and font weight controls
✅ **Sitecore Integration**: Full getValue/setValue SDK integration
✅ **Error Handling**: Graceful error states and validation
✅ **Clean Data**: Structured JSON storage

## Development Workflow

### 1. Start Development Server

```bash
npm run dev
```

Access at: http://localhost:3000

### 2. Make Changes

The app uses Next.js with hot-reload. Edit any file and see changes instantly:

- **Components**: `components/grid-composer/`
- **Data Types**: `lib/types/table.ts`
- **Styles**: Uses Tailwind CSS and Blok components

### 3. Test Locally

Since this is a Sitecore embedded app, you'll need to test in Sitecore XM Cloud. However, you can test the UI locally by:

1. Opening http://localhost:3000
2. The app will show "Error initializing Marketplace SDK" (expected)
3. To simulate Sitecore context, you can temporarily mock the SDK (for UI testing only)

### 4. Build for Production

```bash
npm run build
```

Output: Optimized production build (142 kB total)

## File Structure Overview

### Core Components

```
components/grid-composer/
├── grid-composer.tsx           # Main component (SDK integration)
├── table-builder.tsx         # Table editor UI
├── editable-cell.tsx         # Inline cell editing
├── cell-format-toolbar.tsx   # Formatting controls
└── index.ts                  # Component exports
```

### Data Layer

```
lib/types/table.ts            # Table data structure & utilities
```

### Key Functions

- `createEmptyTable()` - Creates new 3×3 table
- `validateTableData()` - Validates table structure
- `parseTableData()` - Parses JSON to TableData
- `serializeTableData()` - Serializes to JSON

## Deployment

### Quick Deploy to Vercel

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Get URL**: Copy the production URL (e.g., https://grid-composer.vercel.app)

### Configure in Sitecore

1. Go to Sitecore Cloud Portal
2. Create new Marketplace App
3. Set extension point: `xmc:pages:customfield`
4. Enter your deployment URL
5. Install in XM Cloud

See `DEPLOYMENT.md` for detailed instructions.

## Testing in Sitecore

### Prerequisites

- Grid Composer app deployed
- App installed in XM Cloud
- Field configured to use Grid Composer

### Test Checklist

1. **Load Test**:
   - [ ] Open content item with Grid Composer field
   - [ ] Table editor loads (or creates new table)
   - [ ] No console errors

2. **Editing Test**:
   - [ ] Add/remove rows
   - [ ] Add/remove columns
   - [ ] Edit cell content
   - [ ] Apply cell formatting
   - [ ] Reorder rows/columns
   - [ ] Toggle header rows

3. **Save Test**:
   - [ ] Click Save button
   - [ ] Success message appears
   - [ ] Refresh page
   - [ ] Data persists correctly

## Customization Ideas

### Add New Features

**1. Color Picker for Cells**
```typescript
// In lib/types/table.ts, CellFormat already has:
color?: string;
backgroundColor?: string;

// Add color picker in cell-format-toolbar.tsx
```

**2. CSV Export**
```typescript
function exportToCSV(data: TableData): string {
  return data.rows.map(row =>
    row.cells.map(cell => `"${cell.content}"`).join(',')
  ).join('\n');
}
```

**3. Table Templates**
```typescript
function createTemplates() {
  return {
    pricing: createPricingTable(),
    comparison: createComparisonTable(),
    schedule: createScheduleTable(),
  };
}
```

### Modify Table Defaults

Edit `lib/types/table.ts`:

```typescript
// Change default table size
export function createEmptyTable(rows = 5, columns = 4, hasHeaderRow = true)

// Change default cell format
defaultCellFormat: {
  align: 'center',  // Changed from 'left'
  fontWeight: 'medium',  // Changed from 'normal'
}
```

## Common Tasks

### Update Project Name

Already set to "Grid Composer" in:
- `package.json` (name: "grid-composer")
- `app/layout.tsx` (metadata title)

### Change Table Appearance

Edit styles in `table-builder.tsx`:
```typescript
className="border rounded-lg"  // Table container
className="bg-muted/50"        // Header backgrounds
className="ring-2 ring-primary" // Selected cell
```

### Modify Save Behavior

In `grid-composer.tsx`:
```typescript
// Change canvas reload on save
await client.setValue(jsonData, false);  // false = no reload
```

## Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### TypeScript Errors
```bash
# Check types
npm run build
# Types are in lib/types/table.ts
```

### SDK Not Connecting
- Verify app is accessed through Sitecore (not directly)
- Check browser console for handshake errors
- Ensure deployment URL matches Sitecore config

## Next Steps

1. **Deploy to Vercel** (see above)
2. **Configure in Sitecore** (see DEPLOYMENT.md)
3. **Test thoroughly** (see test checklist)
4. **Gather feedback** from content authors
5. **Iterate** based on usage

## Documentation

- **Full Documentation**: `TABLEFORGE_README.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **SDK Reference**: `Sitecore_XMC_MARKETPLACE_SDK_GUIDE.md`

## Need Help?

- Check browser console for errors
- Review Sitecore Marketplace SDK documentation
- Verify extension point configuration
- Test in Sitecore XM Cloud environment

---

**Ready to deploy?** Follow the steps in `DEPLOYMENT.md`!
