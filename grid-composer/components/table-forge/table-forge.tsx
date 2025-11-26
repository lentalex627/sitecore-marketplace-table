"use client";

import React, { useEffect, useState } from "react";
import { useMarketplaceClient } from "@/components/providers/marketplace";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import {
  TableData,
  createEmptyTable,
  parseTableData,
  serializeTableData,
  validateTableData,
} from "@/lib/types/table";
import { TableBuilder } from "./table-builder";
import { Save, X, AlertCircle } from "lucide-react";

/**
 * Grid Composer - Custom Field Integration Component
 *
 * This component integrates with Sitecore XM Cloud as a custom field,
 * providing an interactive table builder interface.
 */
export function GridComposer() {
  const client = useMarketplaceClient();

  // Table data state
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [originalData, setOriginalData] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Load initial table data from Sitecore field
   */
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get current field value from Sitecore
        const fieldValue = await client.getValue();
        console.log("Loaded field value:", fieldValue);

        let parsedData: TableData | null = null;

        if (fieldValue && typeof fieldValue === "string" && fieldValue.trim()) {
          // Try to parse existing data
          parsedData = parseTableData(fieldValue);

          if (!parsedData) {
            console.warn("Invalid table data in field, creating new table");
            setError(
              "Existing data was invalid. Starting with a new table."
            );
          }
        }

        // If no valid data exists, create a new empty table
        if (!parsedData) {
          parsedData = createEmptyTable(3, 3, true);
        }

        setTableData(parsedData);
        setOriginalData(serializeTableData(parsedData));
        setIsDirty(false);
      } catch (err) {
        console.error("Error loading table data:", err);
        setError(
          "Failed to load table data. Starting with a new table."
        );
        // Create empty table as fallback
        const emptyTable = createEmptyTable(3, 3, true);
        setTableData(emptyTable);
        setOriginalData(serializeTableData(emptyTable));
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [client]);

  /**
   * Handle table data changes
   */
  const handleTableChange = (newData: TableData) => {
    setTableData(newData);
    const newSerialized = serializeTableData(newData);
    setIsDirty(newSerialized !== originalData);
    setSuccessMessage(null);
  };

  /**
   * Save table data back to Sitecore field
   */
  const handleSave = async () => {
    if (!tableData) return;

    try {
      setIsSaving(true);
      setError(null);
      setSuccessMessage(null);

      // Validate data before saving
      if (!validateTableData(tableData)) {
        throw new Error("Invalid table data structure");
      }

      // Serialize to JSON
      const jsonData = serializeTableData(tableData);

      // Save to Sitecore field (with canvas reload)
      await client.setValue(jsonData, true);

      // Update original data and mark as clean
      setOriginalData(jsonData);
      setIsDirty(false);
      setSuccessMessage("Table saved successfully!");

      console.log("Table saved successfully");
    } catch (err) {
      console.error("Error saving table:", err);
      setError(
        err instanceof Error ? err.message : "Failed to save table data"
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Cancel changes and restore original data
   */
  const handleCancel = () => {
    if (!originalData) return;

    const parsed = parseTableData(originalData);
    if (parsed) {
      setTableData(parsed);
      setIsDirty(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  /**
   * Render loading state
   */
  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span className="text-muted-foreground">Loading table...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  /**
   * Render error state if table data couldn't be loaded
   */
  if (!tableData) {
    return (
      <Card className="w-full">
        <CardContent className="p-8">
          <Alert variant="danger">
            <AlertCircle className="h-4 w-4" />
            <div className="ml-2">
              <h4 className="font-semibold">Failed to load table</h4>
              <p className="text-sm">
                Could not load table data. Please refresh and try again.
              </p>
            </div>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 space-y-6">
      {/* Header with save/cancel actions */}
      <div className="max-w-7xl mx-auto">
        <Card className="border-2 shadow-lg bg-card/95 backdrop-blur">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Grid Composer
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create and customize your table with ease
                </p>
              </div>
              <div className="flex items-center gap-3">
                {isDirty && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-full">
                    <div className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
                      Unsaved changes
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  disabled={!isDirty || isSaving}
                  className="transition-all hover:scale-105 disabled:scale-100"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!isDirty || isSaving}
                  className="bg-gradient-to-r from-primary to-primary/90 transition-all hover:scale-105 disabled:scale-100 shadow-md hover:shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Table"}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      </div>

      {/* Success message */}
      <div className="max-w-7xl mx-auto">
        {successMessage && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <Alert
              variant="success"
              className="border-2 shadow-md bg-success-bg/80 backdrop-blur"
            >
              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 h-5 w-5 rounded-full bg-success-500 flex items-center justify-center">
                  <svg
                    className="h-3 w-3 text-white"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium">{successMessage}</span>
              </div>
            </Alert>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="animate-in slide-in-from-top-2 duration-300">
            <Alert variant="danger" className="border-2 shadow-md bg-danger-bg/80 backdrop-blur">
              <AlertCircle className="h-5 w-5" />
              <div className="space-y-1">
                <h4 className="font-semibold">Error</h4>
                <p className="text-sm opacity-90">{error}</p>
              </div>
            </Alert>
          </div>
        )}
      </div>

      {/* Main table builder component */}
      <div className="max-w-7xl mx-auto">
        <TableBuilder data={tableData} onChange={handleTableChange} />
      </div>
    </div>
  );
}
