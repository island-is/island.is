import dynamic from 'next/dynamic'

export const PublicVehicleSearch = dynamic(
  () => import('./PublicVehicleSearch/PublicVehicleSearch'),
  { ssr: false },
)

export const AircraftSearch = dynamic(
  () => import('./AircraftSearch/AircraftSearch'),
  {
    ssr: true,
  },
)
export const PlateAvailableSearch = dynamic(
  () => import('./PlateAvailableSearch/PlateAvailableSearch'),
  { ssr: false },
)

export const PublicShipSearch = dynamic(
  () => import('./PublicShipSearch/PublicShipSearch'),
  {
    ssr: false,
  },
)

export const KilometerFee = dynamic(
  () => import('./KilometerFee/KilometerFee'),
  {
    ssr: true,
  },
)

export const NewKilometerFee = dynamic(
  () => import('./NewKilometerFee/NewKilometerFee'),
  {
    ssr: true,
  },
)
