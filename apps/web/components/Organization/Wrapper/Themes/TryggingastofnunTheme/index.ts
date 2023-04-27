import dynamic from 'next/dynamic'

export const TryggingastofnunHeader = dynamic(
  () => import('./TryggingastofnunHeader'),
  { ssr: false },
)

export const TryggingastofnunFooter = dynamic(
  () => import('./TryggingastofnunFooter'),
  { ssr: false },
)
