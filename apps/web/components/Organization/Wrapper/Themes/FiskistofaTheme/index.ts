import dynamic from 'next/dynamic'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: true,
})

export const FiskistofaHeader = dynamic(() => import('./FiskistofaHeader'), {
  ssr: true,
})
