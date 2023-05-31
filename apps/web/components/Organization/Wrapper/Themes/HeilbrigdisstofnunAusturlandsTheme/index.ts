import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunAusturlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsFooter'),
  { ssr: false },
)

export const HeilbrigdisstofnunAusturlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsHeader'),
  { ssr: false },
)
