"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { uploadData, getUrl, remove, list } from 'aws-amplify/storage';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslation } from '@/lib/translations';
import { Loader2, Upload, File, Trash2 } from 'lucide-react';

export function FileManagement() {
  const { t } = useTranslation();
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await list('');
      setFiles(result.items.map(item => item.key).filter(key => key !== undefined));
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      await uploadData({
        key: file.name,
        data: file,
        options: {
          contentType: file.type
        }
      });
      await fetchFiles();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileDownload = async (fileName) => {
    try {
      const result = await getUrl({
        key: fileName,
        options: {
          accessLevel: 'private',
          download: true
        }
      });
      window.open(result.url, '_blank');
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleFileDelete = async (fileName) => {
    try {
      await remove({ key: fileName });
      await fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
    }
  };

  if (isLoading) {
    return React.createElement("div", { className: "flex justify-center" },
      React.createElement(Loader2, { className: "h-8 w-8 animate-spin" })
    );
  }

  return React.createElement("div", null,
    React.createElement("div", { className: "mb-4" },
      React.createElement(Input, {
        type: "file",
        onChange: handleFileUpload,
        disabled: isUploading,
        className: "hidden",
        id: "file-upload"
      }),
      React.createElement("label", { htmlFor: "file-upload" },
        React.createElement(Button, { asChild: true, disabled: isUploading },
          React.createElement("span", null,
            isUploading ? React.createElement(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }) : React.createElement(Upload, { className: "mr-2 h-4 w-4" }),
            t('uploadFile')
          )
        )
      )
    ),
    React.createElement("div", { className: "space-y-2" },
      files.map((file) => (
        React.createElement("div", { key: file, className: "flex items-center justify-between p-2 border rounded" },
          React.createElement("span", { className: "flex items-center" },
            React.createElement(File, { className: "mr-2 h-4 w-4" }),
            file
          ),
          React.createElement("div", null,
            React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => handleFileDownload(file) },
              t('download')
            ),
            React.createElement(Button, { variant: "ghost", size: "sm", onClick: () => handleFileDelete(file) },
              React.createElement(Trash2, { className: "h-4 w-4" })
            )
          )
        )
      ))
    )
  );
}
