/**
 * Create a fake download link from base64 encoded file
 * @param {string} base64File - base64 encoded file data
 * @param {string} mimeType - Mime type of file - 'application/pdf'
 * @param {string} filename - File name for download
 */
export const downloadLink = (
  base64File: string,
  mimeType = 'application/pdf',
  filename: string,
) => {
  const downloadLink = document.createElement('a')
  downloadLink.href = `data:${mimeType};base64,${base64File}`
  downloadLink.download = filename
  downloadLink.click()
}
