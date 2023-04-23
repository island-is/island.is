import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunSudurlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsHeader'),
  { ssr: true },
)

export const HeilbrigdisstofnunSudurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsFooter'),
  { ssr: true },
)
