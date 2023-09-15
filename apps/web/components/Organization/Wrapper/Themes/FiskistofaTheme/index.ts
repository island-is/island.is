import dynamic from 'next/dynamic'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: false,
})

export const FiskistofaHeader = dynamic(() => import('./FiskistofaHeader'), {
  ssr: false,
})
