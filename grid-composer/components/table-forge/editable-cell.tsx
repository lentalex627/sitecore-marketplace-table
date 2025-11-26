"use client";

import React, { useState, useRef, useEffect } from "react";
import { CellFormat } from "@/lib/types/table";

interface EditableCellProps {
  value: string;
  onChange: (value: string) => void;
  isHeader?: boolean;
  format?: CellFormat;
}

/**
 * EditableCell - Inline editable table cell
 *
 * Provides a seamless editing experience where users can:
 * - Click to edit
 * - Press Enter to finish editing
 * - Press Escape to cancel
 */
export function EditableCell({
  value,
  onChange,
  isHeader = false,
  format,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update edit value when prop value changes
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  // Focus input when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  /**
   * Start editing mode
   */
  const handleStartEdit = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  /**
   * Finish editing and save changes
   */
  const handleFinishEdit = () => {
    setIsEditing(false);
    if (editValue !== value) {
      onChange(editValue);
    }
  };

  /**
   * Cancel editing and revert changes
   */
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditValue(value);
  };

  /**
   * Handle keyboard shortcuts
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleFinishEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  /**
   * Handle blur (clicking outside)
   */
  const handleBlur = () => {
    handleFinishEdit();
  };

  /**
   * Get cell styles based on format
   */
  const getCellStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      padding: "8px 12px",
      minHeight: "40px",
      width: "100%",
      display: "flex",
      alignItems: format?.verticalAlign === "top"
        ? "flex-start"
        : format?.verticalAlign === "bottom"
        ? "flex-end"
        : "center",
    };

    if (format?.align) {
      styles.justifyContent =
        format.align === "left"
          ? "flex-start"
          : format.align === "right"
          ? "flex-end"
          : "center";
    }

    if (format?.fontWeight) {
      const fontWeightMap = {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      };
      styles.fontWeight = fontWeightMap[format.fontWeight];
    }

    if (format?.color) {
      styles.color = format.color;
    }

    if (format?.backgroundColor) {
      styles.backgroundColor = format.backgroundColor;
    }

    return styles;
  };

  /**
   * Get input styles to match display styles
   */
  const getInputStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      width: "100%",
      padding: "8px 12px",
      border: "2px solid hsl(var(--primary))",
      borderRadius: "4px",
      outline: "none",
      fontSize: "inherit",
      fontFamily: "inherit",
      backgroundColor: "white",
    };

    if (format?.align) {
      styles.textAlign = format.align;
    }

    if (format?.fontWeight) {
      const fontWeightMap = {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
      };
      styles.fontWeight = fontWeightMap[format.fontWeight];
    }

    return styles;
  };

  if (isEditing) {
    return (
      <div className="p-0 animate-in fade-in duration-150">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={getInputStyles()}
          className="focus:ring-2 focus:ring-primary focus:ring-offset-1 shadow-lg"
        />
      </div>
    );
  }

  return (
    <div
      onClick={handleStartEdit}
      style={getCellStyles()}
      className={`
        cursor-text
        hover:bg-primary/5
        transition-all
        duration-150
        group
        ${isHeader ? "font-semibold" : ""}
        ${!value ? "text-muted-foreground/60 italic" : ""}
      `}
      title="Click to edit"
    >
      <span className="relative">
        {value || (
          <span className="group-hover:text-muted-foreground transition-colors">
            Click to edit...
          </span>
        )}
      </span>
    </div>
  );
}
