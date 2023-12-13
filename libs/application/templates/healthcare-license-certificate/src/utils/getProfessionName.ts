import { ExternalData } from '@island.is/application/types'

export const getProfessionName = (
  externalData: ExternalData,
  professionId: string,
): { is: string; en: string } => {
  const healthcareLicenses =
    (externalData?.healthcareLicenses?.data as {
      professionId: string
      professionNameEn: string
      professionNameIs: string
    }[]) || []

  const selectedLicense = healthcareLicenses.find(
    (x) => x.professionId === professionId,
  )

  return {
    is: selectedLicense?.professionNameIs || '',
    en: selectedLicense?.professionNameEn || '',
  }
}
