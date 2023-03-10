import dynamic from 'next/dynamic'

export const GevHeader = dynamic(() => import('./GevHeader'), { ssr: false })
