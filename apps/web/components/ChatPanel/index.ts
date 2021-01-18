import dynamic from 'next/dynamic'

export const ChatPanel = dynamic(() => import('./ChatPanel'), {
  ssr: false,
})
