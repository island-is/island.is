import dynamic from 'next/dynamic'

import Header from './SyslumennHeader'

export const SyslumennHeader = Header

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: true,
})
