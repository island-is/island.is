import { useOutletContext } from 'react-router-dom'

type TitleContextType = {
  setTitle: (title: string) => void
  title: string
}

export function useTenantTitle() {
  return useOutletContext<TitleContextType>()
}
