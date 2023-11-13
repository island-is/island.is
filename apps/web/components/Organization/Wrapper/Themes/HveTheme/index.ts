import dynamic from 'next/dynamic'

import Header from './HveHeader'

export const HveHeader = Header
export const HveFooter = dynamic(() => import('./HveFooter'), { ssr: true })
