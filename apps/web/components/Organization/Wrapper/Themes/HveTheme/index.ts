import dynamic from 'next/dynamic'

export const HveFooter = dynamic(() => import('./HveFooter'), { ssr: false })
