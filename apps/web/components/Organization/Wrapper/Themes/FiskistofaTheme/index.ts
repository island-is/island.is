import dynamic from 'next/dynamic'

import Header from './FiskistofaHeader'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: true,
})

export const FiskistofaHeader = Header
