import dynamic from 'next/dynamic'

export const TryggingastofnunHeader = dynamic(
  () => import('./TryggingastofnunHeader'),
  { ssr: true },
)

export const TryggingastofnunFooter = dynamic(
  () => import('./TryggingastofnunFooter'),
  { ssr: true },
)
