import { ApplicationContext } from '@island.is/application/core'

export function existsAndKMarking(context: ApplicationContext): boolean {
  const { validation } =
    (context.application.externalData.validateMortgageCertificate.data as {
      validation: { exists: boolean; hasKMarking: boolean }
    }) || {}

  const exists = validation?.exists
  const hasKMarking = validation?.hasKMarking

  return exists && hasKMarking
}

export function exists(context: ApplicationContext): boolean {
  const { validation } =
    (context.application.externalData.validateMortgageCertificate.data as {
      validation: { exists: boolean }
    }) || {}

  const exists = validation?.exists

  return exists
}
