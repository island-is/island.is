import dynamic from 'next/dynamic'

export const StraddlingStockCalculator = dynamic(
  () =>
    import('./calculators/StraddlingStockCalculator/StraddlingStockCalculator'),
  { ssr: false },
)

export const CatchQuotaCalculator = dynamic(
  () => import('./calculators/CatchQuotaCalculator/CatchQuotaCalculator'),
  { ssr: false },
)

export const SelectedShip = dynamic(
  () => import('./SelectedShip/SelectedShip'),
  { ssr: false },
)

export const ShipSearch = dynamic(() => import('./ShipSearch/ShipSearch'), {
  ssr: false,
})

export const SidebarShipSearchInput = dynamic(
  () => import('./SidebarShipSearchInput/SidebarShipSearchInput'),
  {
    ssr: false,
  },
)
