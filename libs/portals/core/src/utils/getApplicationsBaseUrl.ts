export const getApplicationsBaseUrl = () => {
  const path = window?.location?.origin
  const isLocalhost = path?.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/umsoknir' : `${path}/umsoknir`
}

export const getFormSystemApplicationBaseUrl = () => {
  const path = window?.location?.origin
  const isLocalhost = path?.includes('localhost')
  return isLocalhost ? 'http://localhost:4242/form' : `${path}/form`
}
