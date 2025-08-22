'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

export function Dropzone() {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    console.log('Selected file:', file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Note: NEXT_PUBLIC_API_URL is available client-side
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/app/api';
      const response = await fetch(`${apiUrl}/statements/upload`, {
        method: 'POST',
        // Headers are automatically set for FormData by the browser
        // but you need to handle auth (e.g., sending a token)
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Upload successful:', result);
        // Here you would trigger a toast notification and a re-fetch of the statements list
      } else {
        console.error('Upload failed:', await response.text());
      }
    } catch (error) {
      console.error('An error occurred during upload:', error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed
      ${isDragActive ? 'border-primary' : 'border-input'}
      bg-background transition-colors hover:border-primary/80`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here ...</p>
      ) : (
        <p>Drag 'n' drop a statement file here, or click to select a file</p>
      )}
    </div>
  );
}
