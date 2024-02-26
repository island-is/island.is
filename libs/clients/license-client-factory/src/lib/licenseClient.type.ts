import { User } from '@island.is/auth-nest-tools'
import { Locale } from '@island.is/shared/types'

export type PkPassAvailability = 'available' | 'not-available' | 'unknown'

export type PassTemplateIds = {
  adrLicense: string
}

export type PkPassVerificationData = {
  id?: string
  validFrom?: string
  expirationDate?: string
  expirationTime?: string
  status?: string
  whenCreated?: string
  whenModified?: string
  alreadyPaid?: boolean
}

export type PkPassVerification = {
  valid: boolean
  data?: string
}

export type PkPassVerificationInputData = {
  code: string
  date: string
}

export type VerifyInputData = {
  code: string
  date: string
  passTemplateName?: string
  passTemplateId?: string
}

export type PassVerificationData = {
  valid: boolean
  passIdentity?: {
    name: string
    nationalId: string
    picture?: string
  }
}

export interface LicenseClient<ResultType> {
  clientSupportsPkPass: boolean

  getLicenses: (user: User) => Promise<Array<ResultType>>

  licenseIsValidForPkPass?: (payload: unknown) => PkPassAvailability

  getPkPassUrl?: (user: User, locale?: Locale) => Promise<string>

  getPkPassQRCode?: (user: User, locale?: Locale) => Promise<string>

  verifyPkPass?: (
    data: string,
    passTemplateId: string,
  ) => Promise<PkPassVerification>
}

export const LICENSE_CLIENT_FACTORY = 'license-client-factory'

export const LICENSE_UPDATE_CLIENT_FACTORY = 'license-client-factory'

export const CONFIG_PROVIDER = 'config_provider'
