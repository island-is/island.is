import dynamic from 'next/dynamic'

export const AlcoholLicencesList = dynamic(
  () =>
    import('./CardLists/AlcoholLicencesList/AlcoholLicencesList'),
  { ssr: true },
)
