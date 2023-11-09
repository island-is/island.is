import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunNordurlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsHeader'),
  { ssr: true },
)

export const HeilbrigdisstofnunNordurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsFooter'),
  { ssr: true },
)
