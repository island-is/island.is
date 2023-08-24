// ttsl is 3600000 which is 1 hour in milliseconds
export const setItem = ({ key, value, ttl = 3600000 }) => {
  const now = new Date()

  const item = {
    value: value,
    expiry: now.getTime() + ttl,
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(item))
  }
}

export default setItem
