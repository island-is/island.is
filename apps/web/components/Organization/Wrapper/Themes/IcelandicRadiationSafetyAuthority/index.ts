import dynamic from 'next/dynamic'

export const IcelandicRadiationSafetyAuthorityHeader = dynamic(
  () => import('./IcelandicRadiationSafetyAuthorityHeader'),
  { ssr: true },
)
