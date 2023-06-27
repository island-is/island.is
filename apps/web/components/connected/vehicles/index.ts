import dynamic from 'next/dynamic'

export const PublicVehicleSearch = dynamic(
  () => import('./PublicVehicleSearch'),
  { ssr: false },
)
