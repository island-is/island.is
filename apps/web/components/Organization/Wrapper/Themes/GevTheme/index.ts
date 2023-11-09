import dynamic from 'next/dynamic'

export const GevHeader = dynamic(() => import('./GevHeader'), { ssr: true })
export const GevFooter = dynamic(() => import('./GevFooter'), { ssr: true })
