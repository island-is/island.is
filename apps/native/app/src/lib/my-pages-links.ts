import { useMemo } from 'react'

import { useEnvironmentStore } from '../stores/environment-store'

const fallbackBaseUrl = 'https://island.is'

const createMyPagesLinks = (baseUrl: string) => ({
  // For More screen
  accessControl: `${baseUrl}/minarsidur/adgangsstyring/umbod`,
  supportPayments: `${baseUrl}/minarsidur/framfaersla/greidsluaetlun`,
  education: `${baseUrl}/minarsidur/menntun/grunnskoli/namsmat`,
  lawAndOrder: `${baseUrl}/minarsidur/log-og-reglur/yfirlit`,
  occupationalLicenses: `${baseUrl}/minarsidur/starfsleyfi`,
  // For Vehicles screen
  ownerLookup: `${baseUrl}/minarsidur/eignir/okutaeki/leit`,
  vehicleHistory: `${baseUrl}/minarsidur/eignir/okutaeki/okutaekjaferill`,
  reportOwnerChange: `${baseUrl}/umsoknir/eigendaskipti-okutaekis`,
  returnCertificate: `${baseUrl}/umsoknir/skilavottord`,
  nameConfidentiality: `${baseUrl}/umsoknir/nafnleynd-i-okutaekjaskra`,
  // For Vehicle detail screen dropdown
  orderNumberPlate: `${baseUrl}/umsoknir/panta-numeraplotu`,
  orderRegistrationCertificate: `${baseUrl}/umsoknir/panta-skraningarskirteini`,
  changeCoOwner: `${baseUrl}/umsoknir/medeigandi-okutaekis`,
  changeOperator: `${baseUrl}/umsoknir/umradamadur-okutaekis`,
  vehicleHistoryReport: `${baseUrl}/umsoknir/okutaekjaferill`,
  // For assets screen
  mortgageCertificate: `${baseUrl}/umsoknir/vedbokarvottord`,
  // For finance screen
  loans: `${baseUrl}/minarsidur/fjarmal/lan`,
  payments: `${baseUrl}/minarsidur/fjarmal/greidslur/greidslusedlar-og-greidslukvittanir`,
  transactions: `${baseUrl}/minarsidur/fjarmal/faerslur/flokkar`,
  statusOverview: `${baseUrl}/minarsidur/fjarmal/stada`,
})

export const useMyPagesLinks = () => {
  const baseUrl = useEnvironmentStore(
    (state) => state.environment?.baseUrl ?? fallbackBaseUrl,
  )

  return useMemo(() => createMyPagesLinks(baseUrl), [baseUrl])
}
