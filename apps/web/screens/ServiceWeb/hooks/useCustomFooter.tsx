import dynamic from 'next/dynamic'

export const useCustomFooter = (institutionSlug: string) => {
  switch (institutionSlug) {
    case 'stafraent-island':
      return dynamic(() =>
        import('@island.is/web/components').then((mod) => mod.ServiceWebFooter),
      )
    default:
      return false
  }
}
