import { WrappedLoaderFn } from '@island.is/portals/core'

export const adminLoader: WrappedLoaderFn = ({ client }) => {
  // Perform any necessary data fetching or processing here
  return async (): Promise<{ message: string }> => {
    const data = await fetchData()
    return data
  }
}
async function fetchData() {
  // Replace this with actual data fetching logic
  return {
    message: 'Hello, Admin!',
  }
}
