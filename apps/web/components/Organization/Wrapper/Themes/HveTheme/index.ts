import dynamic from 'next/dynamic'

export const HveHeader = dynamic(() => import('./HveHeader'), { ssr: false })
export const HveFooter = dynamic(() => import('./HveFooter'), { ssr: false })
