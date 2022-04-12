import dynamic from 'next/dynamic'
export const UkraineChatPanel = dynamic(() => import('./UkraineChatPanel'), {
  ssr: false,
})
