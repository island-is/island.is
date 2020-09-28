export const logout = () =>
  fetch('/api/auth/logout', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
