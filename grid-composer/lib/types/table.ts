/**
 * TableForge Data Structure
 *
 * This defines the core data structure for tables created in TableForge.
 * The structure is designed to be clean, JSON-serializable, and easy to
 * consume by rendering components.
 */

/**
 * Text alignment options for table cells
 */
export type CellAlignment = 'left' | 'center' | 'right';

/**
 * Vertical alignment options for table cells
 */
export type CellVerticalAlignment = 'top' | 'middle' | 'bottom';

/**
 * Font weight options for cell content
 */
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';

/**
 * Cell formatting metadata
 */
export interface CellFormat {
  /** Horizontal text alignment */
  align?: CellAlignment;
  /** Vertical text alignment */
  verticalAlign?: CellVerticalAlignment;
  /** Font weight */
  fontWeight?: FontWeight;
  /** Text color (hex or CSS color name) */
  color?: string;
  /** Background color (hex or CSS color name) */
  backgroundColor?: string;
  /** Whether text should wrap */
  wrap?: boolean;
}

/**
 * Represents a single cell in the table
 */
export interface TableCell {
  /** Cell content (plain text or HTML) */
  content: string;
  /** Optional formatting for this cell */
  format?: CellFormat;
  /** Cell ID for tracking (generated UUID) */
  id: string;
}

/**
 * Represents a row in the table
 */
export interface TableRow {
  /** Array of cells in this row */
  cells: TableCell[];
  /** Row ID for tracking (generated UUID) */
  id: string;
  /** Whether this row is a header row */
  isHeader?: boolean;
}

/**
 * Column metadata
 */
export interface TableColumn {
  /** Column ID for tracking (generated UUID) */
  id: string;
  /** Optional column label/name */
  label?: string;
  /** Optional default width (CSS value like "200px" or "auto") */
  width?: string;
}

/**
 * Main table data structure
 * This is what gets serialized to JSON and saved to the Sitecore field
 */
export interface TableData {
  /** Version of the data structure (for future migrations) */
  version: string;
  /** Array of rows in the table */
  rows: TableRow[];
  /** Array of column metadata */
  columns: TableColumn[];
  /** Global table settings */
  settings?: {
    /** Whether the first row should be treated as a header */
    hasHeaderRow?: boolean;
    /** Default cell format applied to all cells unless overridden */
    defaultCellFormat?: CellFormat;
    /** Table caption/title */
    caption?: string;
    /** Whether table has borders */
    hasBorders?: boolean;
    /** Whether table should be striped (alternating row colors) */
    isStriped?: boolean;
  };
  /** Metadata about when/who created/modified the table */
  metadata?: {
    created?: string; // ISO date string
    modified?: string; // ISO date string
    createdBy?: string;
    modifiedBy?: string;
  };
}

/**
 * Creates an empty cell with default values
 */
export function createEmptyCell(): TableCell {
  return {
    id: crypto.randomUUID(),
    content: '',
    format: {
      align: 'left',
      verticalAlign: 'middle',
      fontWeight: 'normal',
      wrap: true,
    },
  };
}

/**
 * Creates an empty row with specified number of columns
 */
export function createEmptyRow(columnCount: number, isHeader = false): TableRow {
  return {
    id: crypto.randomUUID(),
    isHeader,
    cells: Array.from({ length: columnCount }, () => createEmptyCell()),
  };
}

/**
 * Creates an empty column
 */
export function createEmptyColumn(): TableColumn {
  return {
    id: crypto.randomUUID(),
    width: 'auto',
  };
}

/**
 * Creates a new empty table with specified dimensions
 */
export function createEmptyTable(rows = 3, columns = 3, hasHeaderRow = true): TableData {
  const tableColumns = Array.from({ length: columns }, () => createEmptyColumn());
  const tableRows = Array.from({ length: rows }, (_, index) =>
    createEmptyRow(columns, hasHeaderRow && index === 0)
  );

  return {
    version: '1.0',
    columns: tableColumns,
    rows: tableRows,
    settings: {
      hasHeaderRow,
      hasBorders: true,
      isStriped: false,
      defaultCellFormat: {
        align: 'left',
        verticalAlign: 'middle',
        fontWeight: 'normal',
        wrap: true,
      },
    },
    metadata: {
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
    },
  };
}

/**
 * Validates that a TableData object has the correct structure
 */
export function validateTableData(data: unknown): data is TableData {
  if (!data || typeof data !== 'object') return false;

  const table = data as TableData;

  // Check required fields
  if (!table.version || !Array.isArray(table.rows) || !Array.isArray(table.columns)) {
    return false;
  }

  // Validate rows
  for (const row of table.rows) {
    if (!row.id || !Array.isArray(row.cells)) return false;
    if (row.cells.length !== table.columns.length) return false;

    // Validate cells
    for (const cell of row.cells) {
      if (!cell.id || typeof cell.content !== 'string') return false;
    }
  }

  // Validate columns
  for (const column of table.columns) {
    if (!column.id) return false;
  }

  return true;
}

/**
 * Parses JSON string into TableData, with validation
 */
export function parseTableData(json: string): TableData | null {
  try {
    const parsed = JSON.parse(json);
    if (validateTableData(parsed)) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Serializes TableData to JSON string
 */
export function serializeTableData(data: TableData): string {
  // Update modified timestamp
  const updatedData = {
    ...data,
    metadata: {
      ...data.metadata,
      modified: new Date().toISOString(),
    },
  };

  return JSON.stringify(updatedData, null, 2);
}
