import dynamic from 'next/dynamic'
export const LiveChatIncChatPanel = dynamic(
  () => import('./LiveChatIncChatPanel'),
  {
    ssr: false,
  },
)
