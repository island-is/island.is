import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunNordurlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsHeader'),
  { ssr: false },
)

export const HeilbrigdisstofnunNordurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsFooter'),
  { ssr: false },
)
