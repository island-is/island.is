import dynamic from 'next/dynamic'

export const SAkHeader = dynamic(() => import('./SAkHeader'), { ssr: true })
export const SAkFooter = dynamic(() => import('./SAkFooter'), { ssr: true })
