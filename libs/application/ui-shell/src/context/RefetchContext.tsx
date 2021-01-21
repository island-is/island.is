import { createContext } from 'react'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const RefetchContext = createContext<() => void>(() => {})
export const RefetchProvider = RefetchContext.Provider
export const RefetchConsumer = RefetchContext.Consumer

export default RefetchContext
