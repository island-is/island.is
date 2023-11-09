import dynamic from 'next/dynamic'

import Header from './ShhHeader'

export const ShhFooter = dynamic(() => import('./ShhFooter'), { ssr: true })
export const ShhHeader = Header
