import dynamic from 'next/dynamic'

export const AlcoholLicencesList = dynamic(
  () => import('./CardLists/AlcoholLicencesList/AlcoholLicencesList'),
  { ssr: true },
)

export const TemporaryEventLicencesList = dynamic(
  () =>
    import('./CardLists/TemporaryEventLicencesList/TemporaryEventLicencesList'),
  { ssr: true },
)
