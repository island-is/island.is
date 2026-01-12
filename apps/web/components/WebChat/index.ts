import dynamic from 'next/dynamic'

export const WebChat = dynamic(() => import('./WebChat'), { ssr: true })
