import dynamic from 'next/dynamic'

export const UtlendingastofnunFooter = dynamic(
  () => import('./UtlendingastofnunFooter'),
  { ssr: true },
)
