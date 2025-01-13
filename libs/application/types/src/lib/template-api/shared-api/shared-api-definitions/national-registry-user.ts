import { ProviderErrorReason } from '@island.is/shared/problem'
import { defineTemplateApi } from '../../TemplateApi'

export interface NationalRegistryParameters {
  ageToValidate?: number
  legalDomicileIceland?: boolean
  ageToValidateError?: ProviderErrorReason
  icelandicCitizenship?: boolean
  allowIfChildHasCitizenship?: boolean
  validateAlreadyHasIcelandicCitizenship?: boolean
  allowPassOnChild?: boolean
  citizenshipWithinEES?: boolean
}

export interface ChildrenCustodyInformationParameters {
  validateHasChildren?: boolean
  validateHasJointCustody?: boolean
}

export interface BirthplaceParameters {
  validateNotEmpty: boolean
}

export interface MunicipalityCodeParameters {
  municipality?: string
}

export const NationalRegistryUserApi =
  defineTemplateApi<NationalRegistryParameters>({
    action: 'nationalRegistry',
    namespace: 'NationalRegistry',
    externalDataId: 'nationalRegistry',
  })
