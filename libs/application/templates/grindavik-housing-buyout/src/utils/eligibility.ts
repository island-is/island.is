import {
  ApplicationContext,
  NationalRegistryIndividual,
} from '@island.is/application/types'

const grindavikPostalCodes = ['240', '241']

export const isEligibleForApplication = (ctx: ApplicationContext) => {
  /* const { address } = ctx.application.externalData.nationalRegistry
    .data as NationalRegistryIndividual

  return (
    !!address?.postalCode && grindavikPostalCodes.includes(address.postalCode)
  ) */

  return true
}
