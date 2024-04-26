export const formatPhoneNumber = (value: string): string =>
  value.length === 7 ? value.substr(0, 3) + '-' + value.substr(3, 6) : value
