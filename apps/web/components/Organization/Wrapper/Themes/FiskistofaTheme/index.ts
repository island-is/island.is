import dynamic from 'next/dynamic'

import DefaultHeader from './FiskistofaDefaultHeader'

export const FiskistofaFooter = dynamic(() => import('./FiskistofaFooter'), {
  ssr: false,
})
export const FiskistofaDefaultHeader = DefaultHeader
