import dynamic from 'next/dynamic'

export const SAkHeader = dynamic(() => import('./SAkHeader'), { ssr: false })
export const SAkFooter = dynamic(() => import('./SAkFooter'), { ssr: false })
