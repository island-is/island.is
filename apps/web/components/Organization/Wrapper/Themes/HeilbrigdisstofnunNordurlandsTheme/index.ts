import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunNordurlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunNordurlandsFooter'),
  { ssr: false },
)
