import dynamic from 'next/dynamic'

import DefaultHeader from './SyslumennDefaultHeader'

export const SyslumennDefaultHeader = DefaultHeader

export const SyslumennFooter = dynamic(() => import('./SyslumennFooter'), {
  ssr: true,
})
