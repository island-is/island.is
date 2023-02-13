import dynamic from 'next/dynamic'

export const UtlendingastofnunHeader = dynamic(
  () => import('./UtlendingastofnunHeader'),
  { ssr: false },
)

export const UtlendingastofnunFooter = dynamic(
  () => import('./UtlendingastofnunFooter'),
  { ssr: false },
)
