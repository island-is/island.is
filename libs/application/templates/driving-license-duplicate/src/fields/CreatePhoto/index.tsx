export const createPhotoComponent = (photoContent?: string) => {
  const PhotoComponent = () => {
    const defaultPlaceholderSrc =
      'data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjY2NjIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgdmlld0JveD0iMCAwIDY0IDY0Ij48Y2lyY2xlIGN4PSIzMiIgY3k9IjIwIiByPSIxMiIvPjxwYXRoIGQ9Ik0xMiA1MmMwLTExLjMgOS4yLTE2IDIwLTE2czIwIDQuNyAyMCAxNmgtNDB6Ii8+PC9zdmc+'

    const imageSrc = photoContent
      ? `data:image/jpeg;base64,${photoContent}`
      : defaultPlaceholderSrc

    return (
      <img
        src={imageSrc}
        alt="Identification photograph"
        width={200}
        height={200}
      />
    )
  }

  return PhotoComponent
}
