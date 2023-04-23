import dynamic from 'next/dynamic'

export const HveHeader = dynamic(() => import('./HveHeader'), { ssr: true })
export const HveFooter = dynamic(() => import('./HveFooter'), { ssr: true })
