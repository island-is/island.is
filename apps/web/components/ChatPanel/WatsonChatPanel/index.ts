import dynamic from 'next/dynamic'
export const WatsonChatPanel = dynamic(() => import('./WatsonChatPanel'), {
  ssr: false,
})

export * from './directorateOfImmigrationChatUtils'
