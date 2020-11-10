export const hexToRgba = (hex: string, alpha: number) => {
  // Requires 6 number hexadecimal
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!rgb) {
    return `rgba(102, 51, 153, 1)`
  }

  const r = parseInt(rgb[1], 16)
  const g = parseInt(rgb[2], 16)
  const b = parseInt(rgb[3], 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
