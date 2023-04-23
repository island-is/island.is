import dynamic from 'next/dynamic'

export const MannaudstorgFooter = dynamic(
  () => import('./MannaudstorgFooter'),
  { ssr: true },
)
