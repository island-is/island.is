export const getInitials = (username?: string) => {
  if (!username) {
    return ''
  }

  const parts = username.trim().split(/\s+/).filter(Boolean)

  if (parts.length === 0) {
    return ''
  }

  let initials = parts[0].charAt(0).toUpperCase()
  if (parts.length > 1) {
    initials += parts[parts.length - 1].charAt(0).toUpperCase()
  }
  return initials
}
