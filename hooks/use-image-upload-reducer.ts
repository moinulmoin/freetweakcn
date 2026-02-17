import { ImageUploadAction, PromptImageWithLoading } from "@/hooks/use-image-upload";
import { Reducer } from "react";

export const imageUploadReducer: Reducer<PromptImageWithLoading[], ImageUploadAction> = (
  state,
  action
) => {
  switch (action.type) {
    case "ADD": {
      const newImages = action.payload.map(({ url }) => ({
        url,
        loading: true,
      }));
      return [...state, ...newImages];
    }
    case "UPDATE_URL": {
      return state.map((image) =>
        image.url === action.payload.tempUrl
          ? { ...image, url: action.payload.finalUrl, loading: false }
          : image
      );
    }
    case "REMOVE": {
      return state.filter((_, i) => i !== action.payload.index);
    }
    case "REMOVE_BY_URL": {
      return state.filter((image) => image.url !== action.payload.url);
    }
    case "CLEAR": {
      return [];
    }
    case "INITIALIZE": {
      return action.payload.map(({ url }) => ({ url, loading: false }));
    }
    default:
      return state;
  }
};
