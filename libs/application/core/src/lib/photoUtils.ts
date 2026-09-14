const PLACEHOLDER_SRC =
  'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjIwIiByPSIxMiIvPjxwYXRoIGQ9Ik0xMiA1MmMwLTExLjMgOS4yLTE2IDIwLTE2czIwIDQuNyAyMCAxNmgtNDB6Ii8+PC9zdmc+'

export const toBase64DataUrl = (photoData?: string): string => {
  if (!photoData) return PLACEHOLDER_SRC

  let cleaned = photoData
  const first = cleaned[0]
  if (
    (first === '"' || first === "'") &&
    cleaned.length >= 2 &&
    cleaned[cleaned.length - 1] === first
  ) {
    cleaned = cleaned.substring(1, cleaned.length - 1).replace(/\\/g, '')
  }

  const isValidBase64 = cleaned.length > 100 && !/[^A-Za-z0-9+/=]/.test(cleaned)

  return isValidBase64 ? `data:image/jpeg;base64,${cleaned}` : PLACEHOLDER_SRC
}
