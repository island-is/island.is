import { createContext } from 'react'

type Refetch = () => void
const RefetchContext = createContext<Refetch | null>(null)
export const RefetchProvider = RefetchContext.Provider
export const RefetchConsumer = RefetchContext.Consumer

export default RefetchContext
