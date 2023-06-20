export const formatNationalId = (value: string) => {
  if (value.length > 6) {
    return `${value.slice(0, 6)}-${value.slice(6)}`.slice(0, 11)
  } else {
    return value
  }
}
