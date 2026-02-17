"use client";

import { HorizontalScrollArea } from "@/components/horizontal-scroll-area";
import { AI_PROMPT_CHARACTER_LIMIT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import CustomTextarea from "@/components/editor/custom-textarea";
import { JSONContent } from "@tiptap/react";
import { DragAndDropImageUploader } from "./drag-and-drop-image-uploader";
import { UploadedImagePreview } from "./uploaded-image-preview";

interface AIChatFormBodyProps {
  isUserDragging: boolean;
  disabled: boolean;
  canSubmit: boolean;
  uploadedImages: { url: string; loading: boolean }[];
  handleImagesUpload: (files: File[]) => void;
  handleImageRemove: (index: number) => void;
  handleContentChange: (jsonContent: JSONContent) => void;
  handleGenerate: () => void;
  initialEditorContent: JSONContent | undefined;
  externalEditorContent?: JSONContent;
  textareaKey?: string | number;
  isStreamingContent?: boolean;
}

export function AIChatFormBody({
  isUserDragging,
  disabled,
  canSubmit,
  uploadedImages,
  handleImagesUpload,
  handleImageRemove,
  handleContentChange,
  handleGenerate,
  initialEditorContent,
  externalEditorContent,
  textareaKey,
  isStreamingContent = false,
}: AIChatFormBodyProps) {
  return (
    <>
      {isUserDragging && (
        <div className={cn("flex h-16 items-center rounded-lg")}>
          <DragAndDropImageUploader
            onDrop={handleImagesUpload}
            disabled={disabled || uploadedImages.some((img) => img.loading)}
          />
        </div>
      )}
      {uploadedImages.length > 0 && !isUserDragging && (
        <div
          className={cn(
            "relative flex h-16 items-center rounded-lg",
            disabled && "pointer-events-none opacity-75"
          )}
        >
          <HorizontalScrollArea className="w-full">
            {uploadedImages.map((img, idx) => (
              <UploadedImagePreview
                key={idx}
                src={img.url}
                isImageLoading={img.loading}
                handleImageRemove={() => handleImageRemove(idx)}
              />
            ))}
          </HorizontalScrollArea>
        </div>
      )}
      <div>
        <label className="sr-only">Chat Input</label>
        <div className="relative isolate min-h-[50px] overflow-hidden" aria-disabled={disabled}>
          <CustomTextarea
            key={textareaKey}
            onContentChange={handleContentChange}
            onSubmit={handleGenerate}
            disabled={disabled}
            canSubmit={canSubmit}
            characterLimit={AI_PROMPT_CHARACTER_LIMIT}
            onImagesPaste={handleImagesUpload}
            initialEditorContent={initialEditorContent}
            externalEditorContent={externalEditorContent}
            isStreamingContent={isStreamingContent}
          />
        </div>
      </div>
    </>
  );
}
