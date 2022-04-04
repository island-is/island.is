import { Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  EinstaklingarApi,
  Heimilisfang,
} from '@island.is/clients/national-registry-v2'
import type { EinstaklingarGetEinstaklingurRequest } from '@island.is/clients/national-registry-v2'
import { GetCompanyApi } from '@island.is/clients/rsk/company-registry'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { UserProfileDTO } from '../entities/dto/user-profile.dto'
import type { GenderValue } from '../entities/dto/user-profile.dto'
import { AddressDTO } from '../entities/dto/address.dto'

@Injectable()
export class UserProfileService {
  constructor(
    private individualApi: EinstaklingarApi,
    private userProfileApi: UserProfileApi,
    private companyRegistryApi: GetCompanyApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfileClaims(auth: User): Promise<UserProfileDTO> {
    const isCompany = !!auth.nationalId.match(/^[4-7]\d{9}$/)
    if (isCompany) {
      return this.getClaimsFromCompanyRegistry(auth).catch(this.handleError)
    } else {
      return this.getIndividualUserProfileClaims(auth)
    }
  }

  async getIndividualUserProfileClaims(auth: User): Promise<UserProfileDTO> {
    const [nationalRegistryClaims, userProfileClaims] = await Promise.all([
      this.getClaimsFromNationalRegistry(auth).catch(this.handleError),
      this.getClaimsFromUserProfile(auth).catch(this.handleError),
    ])
    return { ...nationalRegistryClaims, ...userProfileClaims }
  }

  private handleError = (error: Error): UserProfileDTO => {
    this.logger.error(error)
    return {}
  }

  private async getClaimsFromCompanyRegistry(
    auth: User,
  ): Promise<UserProfileDTO> {
    const companyInfo = await this.companyRegistryApi.getCompany({
      nationalId: auth.nationalId,
    })

    // TODO: Add address and domicile claims when company registry integration has been fixed.
    return {
      name: companyInfo.nafn,
    }
  }

  private async getClaimsFromNationalRegistry(
    auth: User,
  ): Promise<UserProfileDTO> {
    const result = await this.individualApi.einstaklingarGetEinstaklingur(<
      EinstaklingarGetEinstaklingurRequest
    >{
      id: auth.nationalId,
    })

    return {
      name: result.nafn,
      givenName: result.eiginnafn,
      familyName: result.kenninafn,
      middleName: result.millinafn,
      gender: this.formatGender(result.kynkodi),
      address: this.formatAddress(result.adsetur ?? result.logheimili),
      domicile: this.formatAddress(result.logheimili),
      birthdate: this.formatBirthdate(result.faedingardagur),
    }
  }

  private async getClaimsFromUserProfile(auth: User): Promise<UserProfileDTO> {
    const userProfile = await this.userProfileApiWithAuth(
      auth,
    ).userProfileControllerFindOneByNationalId({
      nationalId: auth.nationalId,
    })
    return {
      email: userProfile.email,
      emailVerified: userProfile.emailVerified,
      phoneNumber: userProfile.mobilePhoneNumber,
      phoneNumberVerified: userProfile.mobilePhoneNumberVerified,
      locale: userProfile.locale,
      picture: userProfile.profileImageUrl,
    }
  }

  private formatAddress(address?: Heimilisfang | null): AddressDTO | undefined {
    if (!address) {
      return undefined
    }

    const likelyForeign =
      address.heiti != null &&
      address.stadur == null &&
      address.postnumer == null &&
      address.sveitarfelagsnumer == null
    if (likelyForeign) {
      // When individuals live abroad, the national registry stores the country name under "heiti".
      return {
        country: address.heiti,
      }
    }

    return {
      formatted: this.formattedAddressString(address),
      streetAddress: address.heiti ?? undefined,
      locality: address.stadur ?? undefined,
      postalCode: address.postnumer ?? undefined,
    }
  }

  private formattedAddressString(address: Heimilisfang): string | undefined {
    const icelandicAddress =
      address.heiti &&
      address.stadur &&
      address.postnumer &&
      address.sveitarfelagsnumer

    if (icelandicAddress) {
      return `${address.heiti}\n${address.postnumer} ${address.stadur}\nÍsland`
    }
    return undefined
  }

  private formatBirthdate(date?: Date): string | undefined {
    return !date || isNaN(date.getTime())
      ? undefined
      : date.toISOString().split('T')[0]
  }

  private formatGender(genderCode: string): GenderValue | undefined {
    switch (genderCode) {
      case '1':
      case '3':
        return 'male'
      case '2':
      case '4':
        return 'female'
      case '7':
      case '8':
        return 'non-binary'
      default:
        return undefined
    }
  }
}
