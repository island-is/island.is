import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunAusturlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsFooter'),
  { ssr: false },
)
