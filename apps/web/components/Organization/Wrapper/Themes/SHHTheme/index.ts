import dynamic from 'next/dynamic'

export const ShhFooter = dynamic(() => import('./ShhFooter'), { ssr: true })
