import dynamic from 'next/dynamic'

export const UtlendingastofnunHeader = dynamic(
  () => import('./UtlendingastofnunHeader'),
  { ssr: true },
)

export const UtlendingastofnunFooter = dynamic(
  () => import('./UtlendingastofnunFooter'),
  { ssr: true },
)
