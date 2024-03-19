import dynamic from 'next/dynamic'

export const TryggingastofnunFooter = dynamic(
  () => import('./TryggingastofnunFooter'),
  { ssr: true },
)
