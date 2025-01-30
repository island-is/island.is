import dynamic from 'next/dynamic'

export const SAkFooter = dynamic(() => import('./SAkFooter'), { ssr: true })
