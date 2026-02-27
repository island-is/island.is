import React from 'react'

export const createPhotoComponent = (photoContent?: string) => {
  const cleanPhotoData = (photoData?: string): string => {
    if (!photoData) return ''

    if (photoData.startsWith('"') || photoData.startsWith("'")) {
      let cleaned = photoData.substring(1, photoData.length - 1)
      cleaned = cleaned.replace(/\\/g, '')
      return cleaned
    }

    return photoData
  }

  const PhotoComponent = () => {
    const defaultPlaceholderSrc =
      'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjIwIiByPSIxMiIvPjxwYXRoIGQ9Ik0xMiA1MmMwLTExLjMgOS4yLTE2IDIwLTE2czIwIDQuNyAyMCAxNmgtNDB6Ii8+PC9zdmc+'

    const cleanedContent = cleanPhotoData(photoContent)
    const imageSrc = `data:image/jpeg;base64,${cleanedContent}`

    return (
      <img
        src={imageSrc}
        alt="Identification photograph"
        width={150}
        height={150}
        onError={(e) => {
          ;(e.target as HTMLImageElement).src = defaultPlaceholderSrc
        }}
      />
    )
  }

  return PhotoComponent
}
