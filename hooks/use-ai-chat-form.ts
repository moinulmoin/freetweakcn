"use client";

import { useAILocalDraftStore } from "@/store/ai-local-draft-store";
import { useImageUpload } from "@/hooks/use-image-upload";
import { type PromptImageWithLoading } from "@/hooks/use-image-upload";
import { imageUploadReducer } from "@/hooks/use-image-upload-reducer";
import { MAX_IMAGE_FILES, MAX_IMAGE_FILE_SIZE } from "@/lib/constants";
import { useDocumentDragAndDropIntent } from "@/hooks/use-document-drag-and-drop-intent";
import { convertJSONContentToPromptData } from "@/utils/ai/ai-prompt";
import { JSONContent } from "@tiptap/react";
import { useReducer, useEffect, useRef, useTransition } from "react";

export function useAIChatForm() {
  const {
    editorContentDraft,
    setEditorContentDraft,
    clearLocalDraft,
    imagesDraft,
    setImagesDraft,
  } = useAILocalDraftStore();

  const [isInitializing, startTransition] = useTransition();
  const hasInitialized = useRef(false);

  const [uploadedImages, dispatch] = useReducer(imageUploadReducer, [] as PromptImageWithLoading[]);

  // Initialize uploadedImages from persisted draft once
  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    if (imagesDraft.length === 0) return;

    startTransition(() => {
      dispatch({
        type: "INITIALIZE",
        payload: imagesDraft.map(({ url }) => ({ url })),
      });
    });
  }, [imagesDraft, startTransition]);

  useEffect(() => {
    if (!hasInitialized.current) return;

    const syncedImagesDraft = uploadedImages
      .filter((img) => !img.loading)
      .map(({ url }) => ({ url }));

    const hasSameLength = syncedImagesDraft.length === imagesDraft.length;
    const hasSameUrls =
      hasSameLength && syncedImagesDraft.every((img, index) => img.url === imagesDraft[index]?.url);

    if (hasSameUrls) return;
    setImagesDraft(syncedImagesDraft);
  }, [uploadedImages, imagesDraft, setImagesDraft]);

  const {
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    clearUploadedImages,
    isSomeImageUploading,
  } = useImageUpload({
    maxFiles: MAX_IMAGE_FILES,
    maxFileSize: MAX_IMAGE_FILE_SIZE,
    images: uploadedImages,
    dispatch,
  });

  const { isUserDragging } = useDocumentDragAndDropIntent();

  const promptData = convertJSONContentToPromptData(
    editorContentDraft || { type: "doc", content: [] }
  );

  const isEmptyPrompt =
    uploadedImages.length === 0 &&
    (!promptData?.content?.trim() || promptData.content.length === 0);

  const handleContentChange = (jsonContent: JSONContent) => {
    setEditorContentDraft(jsonContent);
  };

  return {
    editorContentDraft,
    handleContentChange,
    promptData,
    isEmptyPrompt,
    clearLocalDraft,
    uploadedImages,
    fileInputRef,
    handleImagesUpload,
    handleImageRemove,
    clearUploadedImages,
    isSomeImageUploading,
    isUserDragging,
    isInitializing,
  };
}
