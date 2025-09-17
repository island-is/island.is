import { authStore } from '../stores/auth-store'
import { environmentStore } from '../stores/environment-store'

export const getMyPagesLinks = () => {
  const baseUrl =
    environmentStore.getState().environment?.baseUrl ?? 'https://island.is'
  const { userInfo } = authStore.getState()

  return {
    accessControl: `${baseUrl}/minarsidur/adgangsstyring/umbod`,
    supportPayments: `${baseUrl}/minarsidur/framfaersla/greidsluaetlun`,
    education: `${baseUrl}/minarsidur/menntun/grunnskoli/namsmat`,
    lawAndOrder: `${baseUrl}/minarsidur/log-og-reglur/yfirlit`,
    occupationalLicenses: `${baseUrl}/minarsidur/starfsleyfi`,
    ownerLookup: `${baseUrl}/minarsidur/eignir/okutaeki/leit`,
    vehicleHistory: `${baseUrl}/minarsidur/eignir/okutaeki/okutaekjaferill`,
    ownershipCertificatePdf: `${baseUrl}/bff/api?url=https%3A%2F%2Fapi.dev01.devland.is%2Fdownload%2Fv1%2Fvehicles%2Fownership%2Fpdf%2F${userInfo?.nationalId}`,
    reportOwnerChange: `${baseUrl}/umsoknir/eigendaskipti-okutaekis`,
    returnCertificate: `${baseUrl}/umsoknir/skilavottord`,
    nameConfidentiality: `${baseUrl}/umsoknir/nafnleynd-i-okutaekjaskra`,
    // Vehicle detail dropdown placeholders
    orderNumberPlate: `${baseUrl}/umsoknir/panta-numeraplotu`,
    orderRegistrationCertificate: `${baseUrl}/umsoknir/panta-skraningarskirteini`,
    changeCoOwner: `${baseUrl}/umsoknir/medeigandi-okutaekis`,
    changeOperator: `${baseUrl}/umsoknir/umradamadur-okutaekis`,
    vehicleHistoryReport: `${baseUrl}/umsoknir/okutaekjaferill`,
  }
}
