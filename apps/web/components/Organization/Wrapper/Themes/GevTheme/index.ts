import dynamic from 'next/dynamic'

export const GevHeader = dynamic(() => import('./GevHeader'), { ssr: false })
export const GevFooter = dynamic(() => import('./GevFooter'), { ssr: false })
