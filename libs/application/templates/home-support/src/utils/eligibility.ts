import {
  ApplicationContext,
  NationalRegistryIndividual,
} from '@island.is/application/types'

// Árborg
const arborg = ['800', '801', '802', '820', '825']
const supportedPostalCodes = [...arborg]

export const isEligibleForApplication = (ctx: ApplicationContext) => {
  const { address, nationalId } = ctx.application.externalData.nationalRegistry
    .data as NationalRegistryIndividual

  if (nationalId === '0101302399') {
    // Allow test user "Gervimaður Færeyjar"
    return true
  }

  return (
    !!address?.postalCode && supportedPostalCodes.includes(address.postalCode)
  )
}
