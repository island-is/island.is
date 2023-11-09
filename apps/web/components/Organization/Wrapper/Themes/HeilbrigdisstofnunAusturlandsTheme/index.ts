import dynamic from 'next/dynamic'

export const HeilbrigdisstofnunAusturlandsFooter = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsFooter'),
  { ssr: true },
)

export const HeilbrigdisstofnunAusturlandsHeader = dynamic(
  () => import('./HeilbrigdisstofnunAusturlandsHeader'),
  { ssr: true },
)
