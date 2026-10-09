import { useMatches } from 'react-router-dom'
import { PortalModule } from '../types/portalCore'

type LayoutHandle = { layout?: PortalModule['layout'] }

export const useRouteLayout = (): PortalModule['layout'] => {
  const matches = useMatches()

  for (let i = matches.length - 1; i >= 0; i--) {
    const layout = (matches[i].handle as LayoutHandle | undefined)?.layout
    if (layout) {
      return layout
    }
  }

  return undefined
}
