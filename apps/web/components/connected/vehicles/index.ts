import dynamic from 'next/dynamic'

export const PublicVehicleSearch = dynamic(
  () => import('./PublicVehicleSearch'),
  { ssr: false },
)

export const AircraftSearch = dynamic(() => import('./AircraftSearch'), {
  ssr: true,
})
export const PlateAvailableSearch = dynamic(
  () => import('./PlateAvailableSearch'),
  { ssr: false },
)

export const PublicShipSearch = dynamic(() => import('./PublicShipSearch'), {
  ssr: false,
})
