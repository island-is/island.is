import dynamic from 'next/dynamic'

import Header from './GevHeader'

export const GevHeader = Header
export const GevFooter = dynamic(() => import('./GevFooter'), { ssr: true })
