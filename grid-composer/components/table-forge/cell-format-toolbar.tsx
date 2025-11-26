"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  CellFormat,
  CellAlignment,
  FontWeight,
  CellVerticalAlignment,
} from "@/lib/types/table";
import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
} from "lucide-react";

interface CellFormatToolbarProps {
  format: CellFormat | undefined;
  onChange: (format: CellFormat) => void;
  disabled?: boolean;
}

/**
 * CellFormatToolbar - Formatting controls for table cells
 *
 * Provides UI controls for:
 * - Text alignment (left, center, right)
 * - Vertical alignment (top, middle, bottom)
 * - Font weight (normal, medium, semibold, bold)
 */
export function CellFormatToolbar({
  format,
  onChange,
  disabled = false,
}: CellFormatToolbarProps) {
  const currentFormat: CellFormat = format || {
    align: "left",
    verticalAlign: "middle",
    fontWeight: "normal",
    wrap: true,
  };

  const handleAlignChange = (align: CellAlignment) => {
    onChange({ ...currentFormat, align });
  };

  const handleVerticalAlignChange = (verticalAlign: CellVerticalAlignment) => {
    onChange({ ...currentFormat, verticalAlign });
  };

  const handleFontWeightChange = (fontWeight: FontWeight) => {
    onChange({ ...currentFormat, fontWeight });
  };

  return (
    <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded-lg border">
      {/* Horizontal alignment */}
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          Align:
        </span>
        <Button
          size="sm"
          variant={currentFormat.align === "left" ? "default" : "outline"}
          className="h-7 w-7 p-0"
          onClick={() => handleAlignChange("left")}
          disabled={disabled}
          title="Align left"
        >
          <AlignLeft className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant={currentFormat.align === "center" ? "default" : "outline"}
          className="h-7 w-7 p-0"
          onClick={() => handleAlignChange("center")}
          disabled={disabled}
          title="Align center"
        >
          <AlignCenter className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant={currentFormat.align === "right" ? "default" : "outline"}
          className="h-7 w-7 p-0"
          onClick={() => handleAlignChange("right")}
          disabled={disabled}
          title="Align right"
        >
          <AlignRight className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Vertical alignment */}
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          V-Align:
        </span>
        <Button
          size="sm"
          variant={
            currentFormat.verticalAlign === "top" ? "default" : "outline"
          }
          className="h-7 w-7 p-0"
          onClick={() => handleVerticalAlignChange("top")}
          disabled={disabled}
          title="Align top"
        >
          <AlignVerticalJustifyStart className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant={
            currentFormat.verticalAlign === "middle" ? "default" : "outline"
          }
          className="h-7 w-7 p-0"
          onClick={() => handleVerticalAlignChange("middle")}
          disabled={disabled}
          title="Align middle"
        >
          <AlignVerticalJustifyCenter className="h-3.5 w-3.5" />
        </Button>
        <Button
          size="sm"
          variant={
            currentFormat.verticalAlign === "bottom" ? "default" : "outline"
          }
          className="h-7 w-7 p-0"
          onClick={() => handleVerticalAlignChange("bottom")}
          disabled={disabled}
          title="Align bottom"
        >
          <AlignVerticalJustifyEnd className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Font weight */}
      <div className="flex items-center space-x-1">
        <span className="text-xs font-medium text-muted-foreground mr-1">
          Weight:
        </span>
        <Button
          size="sm"
          variant={
            currentFormat.fontWeight === "normal" ? "default" : "outline"
          }
          className="h-7 px-2 text-xs"
          onClick={() => handleFontWeightChange("normal")}
          disabled={disabled}
        >
          Normal
        </Button>
        <Button
          size="sm"
          variant={
            currentFormat.fontWeight === "medium" ? "default" : "outline"
          }
          className="h-7 px-2 text-xs font-medium"
          onClick={() => handleFontWeightChange("medium")}
          disabled={disabled}
        >
          Medium
        </Button>
        <Button
          size="sm"
          variant={
            currentFormat.fontWeight === "semibold" ? "default" : "outline"
          }
          className="h-7 px-2 text-xs font-semibold"
          onClick={() => handleFontWeightChange("semibold")}
          disabled={disabled}
        >
          Semibold
        </Button>
        <Button
          size="sm"
          variant={currentFormat.fontWeight === "bold" ? "default" : "outline"}
          className="h-7 px-2 text-xs font-bold"
          onClick={() => handleFontWeightChange("bold")}
          disabled={disabled}
        >
          Bold
        </Button>
      </div>
    </div>
  );
}
