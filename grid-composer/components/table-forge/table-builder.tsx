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
    <Card className="border-2 shadow-xl bg-card/95 backdrop-blur">
      <CardContent className="p-8">
        <div className="space-y-6">
          {/* Table controls */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-muted/50 to-muted/30 rounded-xl border">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddRow}
                className="shadow-sm hover:shadow-md transition-all hover:scale-105 bg-background"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Row
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddColumn}
                className="shadow-sm hover:shadow-md transition-all hover:scale-105 bg-background"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Column
              </Button>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-background/80 rounded-full border shadow-sm">
              <div className="h-2 w-2 bg-primary rounded-full" />
              <span className="text-sm font-medium">
                {data.rows.length} × {data.columns.length}
              </span>
            </div>
          </div>

          {/* Cell formatting toolbar */}
          {selectedCell && selectedCellData && (
            <div className="border-2 rounded-xl p-4 bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <div className="mb-3 flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-primary rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary">
                  Formatting Cell: Row {selectedCell.rowIndex + 1}, Column{" "}
                  {selectedCell.cellIndex + 1}
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
          <div className="overflow-auto border-2 rounded-xl shadow-lg bg-background">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {/* Row controls header */}
                  <th className="bg-gradient-to-br from-muted/70 to-muted/50 border-b-2 border-r-2 p-3 w-40 text-xs font-semibold tracking-wide sticky left-0 z-10 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 bg-primary rounded-full" />
                      <span>Row Controls</span>
                    </div>
                  </th>
                  {/* Column headers with controls */}
                  {data.columns.map((column, colIndex) => (
                    <th
                      key={column.id}
                      className="bg-gradient-to-br from-muted/70 to-muted/50 border-b-2 p-3 min-w-[180px] group hover:from-muted hover:to-muted/70 transition-colors"
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-background/80 transition-all hover:scale-110"
                            onClick={() => handleMoveColumnLeft(colIndex)}
                            disabled={colIndex === 0}
                            title="Move column left"
                          >
                            <ChevronLeft className="h-3.5 w-3.5" />
                          </Button>
                          <span className="text-xs font-bold px-2 py-1 bg-background/60 rounded-md min-w-[50px] text-center">
                            Col {colIndex + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-background/80 transition-all hover:scale-110"
                            onClick={() => handleMoveColumnRight(colIndex)}
                            disabled={colIndex === data.columns.length - 1}
                            title="Move column right"
                          >
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                            onClick={() => handleInsertColumnAfter(colIndex)}
                            title="Insert column after"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Insert
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 bg-background/80 hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
                  <tr key={row.id} className="group hover:bg-muted/20 transition-colors">
                    {/* Row controls */}
                    <td className="bg-gradient-to-r from-muted/50 to-muted/30 border-r-2 p-3 sticky left-0 z-10 shadow-sm">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="flex items-center gap-1.5">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-background/80 transition-all hover:scale-110"
                            onClick={() => handleMoveRowUp(rowIndex)}
                            disabled={rowIndex === 0}
                            title="Move row up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </Button>
                          <span className="text-xs font-bold px-2 py-1 bg-background/60 rounded-md min-w-[40px] text-center">
                            {rowIndex + 1}
                          </span>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 hover:bg-background/80 transition-all hover:scale-110"
                            onClick={() => handleMoveRowDown(rowIndex)}
                            disabled={rowIndex === data.rows.length - 1}
                            title="Move row down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant={row.isHeader ? "default" : "outline"}
                          className={`h-7 px-3 text-xs w-full transition-all shadow-sm ${
                            row.isHeader
                              ? "bg-gradient-to-r from-primary to-primary/90"
                              : "hover:border-primary"
                          }`}
                          onClick={() => handleToggleHeader(rowIndex)}
                          title="Toggle header row"
                        >
                          {row.isHeader ? "Header" : "Normal"}
                        </Button>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 px-2 text-xs bg-background/80 hover:bg-primary hover:text-primary-foreground transition-all shadow-sm"
                            onClick={() => handleInsertRowAfter(rowIndex)}
                            title="Insert row after"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 bg-background/80 hover:bg-red-500 hover:text-white transition-all shadow-sm"
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
                        className={`border p-0 transition-all ${
                          row.isHeader ? "bg-gradient-to-br from-muted/30 to-muted/20" : "bg-background"
                        } ${
                          selectedCell?.rowIndex === rowIndex &&
                          selectedCell?.cellIndex === cellIndex
                            ? "ring-2 ring-primary ring-inset shadow-lg shadow-primary/20 scale-[1.02] z-10"
                            : "hover:bg-muted/30"
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
