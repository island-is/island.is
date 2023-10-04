import dynamic from 'next/dynamic'

export const HmsHeader = dynamic(() => import('./HmsHeader'), { ssr: false })
