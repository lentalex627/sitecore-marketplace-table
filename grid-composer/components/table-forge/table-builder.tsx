"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TableData,
  CellFormat,
  createEmptyRow,
  createEmptyColumn,
  createEmptyCell,
} from "@/lib/types/table";
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { EditableCell } from "./editable-cell";
import { CellFormatToolbar } from "./cell-format-toolbar";

interface TableBuilderProps {
  data: TableData;
  onChange: (data: TableData) => void;
}

/**
 * TableBuilder - Interactive table editing component
 *
 * Provides UI for:
 * - Adding/removing rows and columns
 * - Inline cell editing
 * - Row and column reordering
 * - Header row configuration
 */
export function TableBuilder({ data, onChange }: TableBuilderProps) {
  const [selectedCell, setSelectedCell] = useState<{
    rowIndex: number;
    cellIndex: number;
  } | null>(null);

  /**
   * Add a new row at the end of the table
   */
  const handleAddRow = () => {
    const newRow = createEmptyRow(data.columns.length, false);
    const updatedData: TableData = {
      ...data,
      rows: [...data.rows, newRow],
    };
    onChange(updatedData);
  };

  /**
   * Add a new row at a specific index
   */
  const handleInsertRowAfter = (index: number) => {
    const newRow = createEmptyRow(data.columns.length, false);
    const updatedRows = [...data.rows];
    updatedRows.splice(index + 1, 0, newRow);

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Remove a row at specific index
   */
  const handleRemoveRow = (index: number) => {
    // Prevent removing all rows
    if (data.rows.length <= 1) return;

    const updatedRows = data.rows.filter((_, i) => i !== index);
    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Move a row up
   */
  const handleMoveRowUp = (index: number) => {
    if (index === 0) return;

    const updatedRows = [...data.rows];
    [updatedRows[index - 1], updatedRows[index]] = [
      updatedRows[index],
      updatedRows[index - 1],
    ];

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Move a row down
   */
  const handleMoveRowDown = (index: number) => {
    if (index === data.rows.length - 1) return;

    const updatedRows = [...data.rows];
    [updatedRows[index], updatedRows[index + 1]] = [
      updatedRows[index + 1],
      updatedRows[index],
    ];

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Add a new column at the end of the table
   */
  const handleAddColumn = () => {
    const newColumn = createEmptyColumn();
    const updatedColumns = [...data.columns, newColumn];

    // Add a new cell to each row
    const updatedRows = data.rows.map((row) => ({
      ...row,
      cells: [...row.cells, createEmptyCell()],
    }));

    const updatedData: TableData = {
      ...data,
      columns: updatedColumns,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Insert a column after a specific index
   */
  const handleInsertColumnAfter = (index: number) => {
    const newColumn = createEmptyColumn();
    const updatedColumns = [...data.columns];
    updatedColumns.splice(index + 1, 0, newColumn);

    // Add a new cell to each row at the specified position
    const updatedRows = data.rows.map((row) => {
      const updatedCells = [...row.cells];
      updatedCells.splice(index + 1, 0, createEmptyCell());
      return {
        ...row,
        cells: updatedCells,
      };
    });

    const updatedData: TableData = {
      ...data,
      columns: updatedColumns,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Remove a column at specific index
   */
  const handleRemoveColumn = (index: number) => {
    // Prevent removing all columns
    if (data.columns.length <= 1) return;

    const updatedColumns = data.columns.filter((_, i) => i !== index);

    // Remove the cell at the specified index from each row
    const updatedRows = data.rows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, i) => i !== index),
    }));

    const updatedData: TableData = {
      ...data,
      columns: updatedColumns,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Move a column left
   */
  const handleMoveColumnLeft = (index: number) => {
    if (index === 0) return;

    const updatedColumns = [...data.columns];
    [updatedColumns[index - 1], updatedColumns[index]] = [
      updatedColumns[index],
      updatedColumns[index - 1],
    ];

    const updatedRows = data.rows.map((row) => {
      const updatedCells = [...row.cells];
      [updatedCells[index - 1], updatedCells[index]] = [
        updatedCells[index],
        updatedCells[index - 1],
      ];
      return { ...row, cells: updatedCells };
    });

    const updatedData: TableData = {
      ...data,
      columns: updatedColumns,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Move a column right
   */
  const handleMoveColumnRight = (index: number) => {
    if (index === data.columns.length - 1) return;

    const updatedColumns = [...data.columns];
    [updatedColumns[index], updatedColumns[index + 1]] = [
      updatedColumns[index + 1],
      updatedColumns[index],
    ];

    const updatedRows = data.rows.map((row) => {
      const updatedCells = [...row.cells];
      [updatedCells[index], updatedCells[index + 1]] = [
        updatedCells[index + 1],
        updatedCells[index],
      ];
      return { ...row, cells: updatedCells };
    });

    const updatedData: TableData = {
      ...data,
      columns: updatedColumns,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Update cell content
   */
  const handleCellChange = (
    rowIndex: number,
    cellIndex: number,
    newContent: string
  ) => {
    const updatedRows = [...data.rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      cells: updatedRows[rowIndex].cells.map((cell, i) =>
        i === cellIndex ? { ...cell, content: newContent } : cell
      ),
    };

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Toggle row as header
   */
  const handleToggleHeader = (rowIndex: number) => {
    const updatedRows = [...data.rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      isHeader: !updatedRows[rowIndex].isHeader,
    };

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
      settings: {
        ...data.settings,
        hasHeaderRow: updatedRows.some((row) => row.isHeader),
      },
    };
    onChange(updatedData);
  };

  /**
   * Update cell format
   */
  const handleCellFormatChange = (
    rowIndex: number,
    cellIndex: number,
    newFormat: CellFormat
  ) => {
    const updatedRows = [...data.rows];
    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      cells: updatedRows[rowIndex].cells.map((cell, i) =>
        i === cellIndex ? { ...cell, format: newFormat } : cell
      ),
    };

    const updatedData: TableData = {
      ...data,
      rows: updatedRows,
    };
    onChange(updatedData);
  };

  /**
   * Get the currently selected cell
   */
  const getSelectedCellData = () => {
    if (!selectedCell) return null;
    return data.rows[selectedCell.rowIndex]?.cells[selectedCell.cellIndex];
  };

  const selectedCellData = getSelectedCellData();

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Table controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button size="sm" variant="outline" onClick={handleAddRow}>
                <Plus className="h-4 w-4 mr-1" />
                Add Row
              </Button>
              <Button size="sm" variant="outline" onClick={handleAddColumn}>
                <Plus className="h-4 w-4 mr-1" />
                Add Column
              </Button>
            </div>
            <div className="text-sm text-muted-foreground">
              {data.rows.length} rows × {data.columns.length} columns
            </div>
          </div>

          {/* Cell formatting toolbar */}
          {selectedCell && selectedCellData && (
            <div className="border rounded-lg p-3 bg-card">
              <div className="mb-2">
                <span className="text-sm font-medium">
                  Format Cell (Row {selectedCell.rowIndex + 1}, Column{" "}
                  {selectedCell.cellIndex + 1})
                </span>
              </div>
              <CellFormatToolbar
                format={selectedCellData.format}
                onChange={(newFormat) =>
                  handleCellFormatChange(
                    selectedCell.rowIndex,
                    selectedCell.cellIndex,
                    newFormat
                  )
                }
              />
            </div>
          )}

          {/* Table editor */}
          <div className="overflow-auto border rounded-lg">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {/* Row controls header */}
                  <th className="bg-muted/50 border-b border-r p-2 w-32 text-xs font-medium">
                    Row Controls
                  </th>
                  {/* Column headers with controls */}
                  {data.columns.map((column, colIndex) => (
                    <th
                      key={column.id}
                      className="bg-muted/50 border-b p-2 min-w-[150px]"
                    >
                      <div className="flex flex-col space-y-1">
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveColumnLeft(colIndex)}
                            disabled={colIndex === 0}
                            title="Move column left"
                          >
                            <ChevronLeft className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium">
                            Col {colIndex + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveColumnRight(colIndex)}
                            disabled={colIndex === data.columns.length - 1}
                            title="Move column right"
                          >
                            <ChevronRight className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleInsertColumnAfter(colIndex)}
                            title="Insert column after"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Insert
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveColumn(colIndex)}
                            disabled={data.columns.length <= 1}
                            title="Delete column"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, rowIndex) => (
                  <tr key={row.id}>
                    {/* Row controls */}
                    <td className="bg-muted/50 border-r p-2">
                      <div className="flex flex-col items-center space-y-1">
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveRowUp(rowIndex)}
                            disabled={rowIndex === 0}
                            title="Move row up"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </Button>
                          <span className="text-xs font-medium">
                            {rowIndex + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleMoveRowDown(rowIndex)}
                            disabled={rowIndex === data.rows.length - 1}
                            title="Move row down"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant={row.isHeader ? "default" : "outline"}
                          className="h-6 px-2 text-xs w-full"
                          onClick={() => handleToggleHeader(rowIndex)}
                          title="Toggle header row"
                        >
                          {row.isHeader ? "Header" : "Normal"}
                        </Button>
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={() => handleInsertRowAfter(rowIndex)}
                            title="Insert row after"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveRow(rowIndex)}
                            disabled={data.rows.length <= 1}
                            title="Delete row"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </td>
                    {/* Table cells */}
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={cell.id}
                        className={`border p-0 ${
                          row.isHeader ? "bg-muted/20" : ""
                        } ${
                          selectedCell?.rowIndex === rowIndex &&
                          selectedCell?.cellIndex === cellIndex
                            ? "ring-2 ring-primary ring-inset"
                            : ""
                        }`}
                        onClick={() =>
                          setSelectedCell({ rowIndex, cellIndex })
                        }
                      >
                        <EditableCell
                          value={cell.content}
                          onChange={(newContent) =>
                            handleCellChange(rowIndex, cellIndex, newContent)
                          }
                          isHeader={row.isHeader}
                          format={cell.format}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
