export const getUriFromImageStr = (
  imageData: string | undefined | null,
): string | null => {
  return imageData?.length
    ? `data:image/jpeg;base64,${imageData.substring(1, imageData.length - 1)}`
    : null
}
