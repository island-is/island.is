import dynamic from 'next/dynamic'

export const AlcoholLicencesList = dynamic(
  () => import('./CardLists/AlcoholLicencesList/AlcoholLicencesList'),
  { ssr: false },
)

export const TemporaryEventLicencesList = dynamic(
  () =>
    import('./CardLists/TemporaryEventLicencesList/TemporaryEventLicencesList'),
  { ssr: false },
)

export const BrokersList = dynamic(
  () => import('./TableLists/BrokersList/BrokersList'),
  { ssr: false },
)
