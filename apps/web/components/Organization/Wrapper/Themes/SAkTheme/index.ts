import dynamic from 'next/dynamic'

import Header from './SAkHeader'

export const SAkHeader = Header
export const SAkFooter = dynamic(() => import('./SAkFooter'), { ssr: true })
