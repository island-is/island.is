import dynamic from 'next/dynamic'
export const BoostChatPanel = dynamic(() => import('./BoostChatPanel'), {
  ssr: false,
})
