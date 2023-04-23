import dynamic from 'next/dynamic'
export const WatsonChatPanel = dynamic(() => import('./WatsonChatPanel'), {
  ssr: true,
})

export * from './utils'
