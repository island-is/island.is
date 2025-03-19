import dynamic from 'next/dynamic'

export const GevFooter = dynamic(() => import('./GevFooter'), { ssr: true })
