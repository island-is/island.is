import dynamic from 'next/dynamic'

export const ShhFooter = dynamic(() => import('./ShhFooter'), { ssr: false })
export const ShhHeader = dynamic(() => import('./ShhHeader'), { ssr: false })
