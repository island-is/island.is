import dynamic from 'next/dynamic'

import Header from './FiskistofaHeader'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: false,
})

export const FiskistofaHeader = Header
