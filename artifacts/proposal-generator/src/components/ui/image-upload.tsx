import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useUploadLogo } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  className?: string;
  placeholder?: string;
}

export function ImageUpload({ value, onChange, className, placeholder = "Upload image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const uploadLogo = useUploadLogo();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setIsUploading(true);

      try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          
          try {
            const result = await uploadLogo.mutateAsync({
              data: {
                base64Data,
                mimeType: file.type,
                fileName: file.name
              }
            });
            onChange(result.url);
          } catch (err) {
            console.error("Failed to upload image", err);
          } finally {
            setIsUploading(false);
          }
        };
      } catch (error) {
        console.error("Error reading file", error);
        setIsUploading(false);
      }
    },
    [uploadLogo, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.svg']
    },
    maxFiles: 1,
    multiple: false
  });

  if (value) {
    return (
      <div className={cn("relative group rounded-md border border-border bg-card overflow-hidden flex items-center justify-center h-32", className)}>
        <img src={value} alt="Uploaded" className="max-h-full max-w-full object-contain p-2" />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onChange("");
            }}
            className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed rounded-md p-4 h-32 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
        isDragActive ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50 hover:border-primary/50",
        isUploading && "pointer-events-none opacity-50",
        className
      )}
    >
      <input {...getInputProps()} />
      {isUploading ? (
        <div className="flex flex-col items-center text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-primary" />
          <span className="text-sm">Uploading...</span>
        </div>
      ) : (
        <div className="flex flex-col items-center text-muted-foreground">
          <div className="p-2 bg-muted rounded-full mb-2 group-hover:bg-primary/10 transition-colors">
            <ImageIcon className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">{placeholder}</p>
          <p className="text-xs mt-1 text-muted-foreground/70">Drag & drop or click to browse</p>
        </div>
      )}
    </div>
  );
}
