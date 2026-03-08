"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Upload, X, FileIcon } from "lucide-react";

export interface FileUploadProps {
  onChange?: (files: File[]) => void;
  accept?: string;
  maxSize?: number; // bytes
  multiple?: boolean;
  label?: string;
  error?: string;
  className?: string;
}

export function FileUpload({
  onChange,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = false,
  label,
  error,
  className,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [sizeError, setSizeError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return;
    const validFiles: File[] = [];
    setSizeError(null);

    Array.from(newFiles).forEach((file) => {
      if (file.size > maxSize) {
        setSizeError(`File "${file.name}" exceeds max size of ${(maxSize / 1024 / 1024).toFixed(0)}MB`);
      } else {
        validFiles.push(file);
      }
    });

    const updated = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
    setFiles(updated);
    onChange?.(updated);
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    onChange?.(updated);
  };

  return (
    <div className={cn("w-full", className)}>
      {label && <label className="mb-1.5 block text-sm font-medium text-text-primary">{label}</label>}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors",
          dragOver ? "border-cyan bg-cyan/5" : "border-border hover:border-cyan/50",
          (error || sizeError) && "border-error"
        )}
      >
        <Upload className="mb-2 h-8 w-8 text-text-muted" />
        <p className="text-sm text-text-muted">Drop files here or click to browse</p>
        <p className="mt-1 text-xs text-text-muted">Max size: {(maxSize / 1024 / 1024).toFixed(0)}MB</p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </div>
      {(error || sizeError) && (
        <p className="mt-1 text-sm text-error">{error || sizeError}</p>
      )}
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center gap-2 rounded border border-border bg-surface p-2">
              <FileIcon className="h-4 w-4 text-text-muted" />
              <span className="flex-1 truncate text-sm text-text-primary">{file.name}</span>
              <span className="text-xs text-text-muted">{(file.size / 1024).toFixed(0)}KB</span>
              <button onClick={() => removeFile(i)} className="text-text-muted hover:text-error">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
