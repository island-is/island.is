import dynamic from 'next/dynamic'

import DefaultHeader from './FiskistofaDefaultHeader'
import Header from './FiskistofaHeader'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: false,
})

export const FiskistofaHeader = Header
export const FiskistofaDefaultHeader = DefaultHeader
