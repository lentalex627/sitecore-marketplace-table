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
    <div className="flex items-center gap-4 p-3 bg-background/60 backdrop-blur rounded-xl border-2 shadow-sm">
      {/* Horizontal alignment */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-foreground/70 tracking-wide uppercase mr-1">
          Align
        </span>
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg">
          <Button
            size="sm"
            variant={currentFormat.align === "left" ? "default" : "ghost"}
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.align === "left"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleAlignChange("left")}
            disabled={disabled}
            title="Align left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={currentFormat.align === "center" ? "default" : "ghost"}
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.align === "center"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleAlignChange("center")}
            disabled={disabled}
            title="Align center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={currentFormat.align === "right" ? "default" : "ghost"}
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.align === "right"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleAlignChange("right")}
            disabled={disabled}
            title="Align right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 bg-border/50" />

      {/* Vertical alignment */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-foreground/70 tracking-wide uppercase mr-1">
          V-Align
        </span>
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg">
          <Button
            size="sm"
            variant={
              currentFormat.verticalAlign === "top" ? "default" : "ghost"
            }
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.verticalAlign === "top"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleVerticalAlignChange("top")}
            disabled={disabled}
            title="Align top"
          >
            <AlignVerticalJustifyStart className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={
              currentFormat.verticalAlign === "middle" ? "default" : "ghost"
            }
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.verticalAlign === "middle"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleVerticalAlignChange("middle")}
            disabled={disabled}
            title="Align middle"
          >
            <AlignVerticalJustifyCenter className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant={
              currentFormat.verticalAlign === "bottom" ? "default" : "ghost"
            }
            className={`h-8 w-8 p-0 transition-all ${
              currentFormat.verticalAlign === "bottom"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleVerticalAlignChange("bottom")}
            disabled={disabled}
            title="Align bottom"
          >
            <AlignVerticalJustifyEnd className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator orientation="vertical" className="h-8 bg-border/50" />

      {/* Font weight */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-bold text-foreground/70 tracking-wide uppercase mr-1">
          Weight
        </span>
        <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg">
          <Button
            size="sm"
            variant={
              currentFormat.fontWeight === "normal" ? "default" : "ghost"
            }
            className={`h-8 px-3 text-xs transition-all ${
              currentFormat.fontWeight === "normal"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleFontWeightChange("normal")}
            disabled={disabled}
          >
            Normal
          </Button>
          <Button
            size="sm"
            variant={
              currentFormat.fontWeight === "medium" ? "default" : "ghost"
            }
            className={`h-8 px-3 text-xs font-medium transition-all ${
              currentFormat.fontWeight === "medium"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleFontWeightChange("medium")}
            disabled={disabled}
          >
            Medium
          </Button>
          <Button
            size="sm"
            variant={
              currentFormat.fontWeight === "semibold" ? "default" : "ghost"
            }
            className={`h-8 px-3 text-xs font-semibold transition-all ${
              currentFormat.fontWeight === "semibold"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleFontWeightChange("semibold")}
            disabled={disabled}
          >
            Semibold
          </Button>
          <Button
            size="sm"
            variant={currentFormat.fontWeight === "bold" ? "default" : "ghost"}
            className={`h-8 px-3 text-xs font-bold transition-all ${
              currentFormat.fontWeight === "bold"
                ? "bg-primary shadow-md"
                : "hover:bg-background"
            }`}
            onClick={() => handleFontWeightChange("bold")}
            disabled={disabled}
          >
            Bold
          </Button>
        </div>
      </div>
    </div>
  );
}
