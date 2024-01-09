export const getDocument = (content: string, type: 'html' | 'pdf') => {
  const uri =
    type === 'html'
      ? `data:text/html,${content}`
      : `data:application/pdf;base64,${content}`
  return encodeURI(uri)
}
