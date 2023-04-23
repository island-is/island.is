import dynamic from 'next/dynamic'

export const StraddlingStockCalculator = dynamic(
  () =>
    import('./calculators/StraddlingStockCalculator/StraddlingStockCalculator'),
  { ssr: true },
)

export const CatchQuotaCalculator = dynamic(
  () => import('./calculators/CatchQuotaCalculator/CatchQuotaCalculator'),
  { ssr: true },
)

export const SelectedShip = dynamic(
  () => import('./SelectedShip/SelectedShip'),
  { ssr: true },
)

export const ShipSearch = dynamic(() => import('./ShipSearch/ShipSearch'), {
  ssr: true,
})

export const SidebarShipSearchInput = dynamic(
  () => import('./SidebarShipSearchInput/SidebarShipSearchInput'),
  {
    ssr: true,
  },
)

export const ShipSearchBoxedInput = dynamic(
  () => import('./ShipSearchBoxedInput/ShipSearchBoxedInput'),
  {
    ssr: true,
  },
)
