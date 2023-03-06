import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunSudurlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsHeader'),
  { ssr: false },
)

export const HeilbrigdisstofnunSudurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunSudurlandsFooter'),
  { ssr: false },
)
