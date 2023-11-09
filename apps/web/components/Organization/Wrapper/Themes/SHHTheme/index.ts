import dynamic from 'next/dynamic'

export const ShhFooter = dynamic(() => import('./ShhFooter'), { ssr: true })
export const ShhHeader = dynamic(() => import('./ShhHeader'), { ssr: true })
