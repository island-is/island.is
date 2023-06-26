interface Props {
  key: string
  clear?: boolean
}

export const getItem = ({ key, clear }: Props) => {
  if (clear) {
    localStorage.removeItem(key)
    return null
  }

  if (typeof window !== 'undefined') {
    const itemStr = localStorage.getItem(key)
    if (!itemStr) {
      return null
    }
    const item = JSON.parse(itemStr)
    const now = new Date()

    if (!item.expiry) {
      return null
    }

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key)
      return null
    }
    return item.value
  }
  return null
}

export default getItem
