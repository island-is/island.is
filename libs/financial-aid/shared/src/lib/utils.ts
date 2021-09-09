export const getFileType = (fileName: string) => {
  return fileName.substring(fileName.lastIndexOf('.') + 1)
}

export const getFileSizeInKilo = (file: { size?: number }) => {
  return Math.floor(file.size ? file.size / 1000 : 0)
}
