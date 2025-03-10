import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunSudurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsFooter'),
  { ssr: false },
)
