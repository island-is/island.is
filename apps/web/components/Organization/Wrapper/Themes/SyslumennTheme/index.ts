import dynamic from 'next/dynamic'

import DefaultHeader from './SyslumennDefaultHeader'
import Header from './SyslumennHeader'

export const SyslumennHeader = Header

export const SyslumennDefaultHeader = DefaultHeader

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: true,
})
