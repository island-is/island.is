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

export const BrokersList = dynamic(
  () => import('./TableLists/BrokersList/BrokersList'),
  { ssr: true },
)

export const MasterList = dynamic(
  () => import('./TableLists/MasterList/MasterList'),
  { ssr: true },
)
