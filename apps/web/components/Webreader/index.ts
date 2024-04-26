import dynamic from 'next/dynamic'

export const Webreader = dynamic(() => import('./Webreader'), { ssr: true })
