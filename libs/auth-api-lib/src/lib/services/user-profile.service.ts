import { Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  NationalRegistryClientService,
  AddressDto as NationalRegistryAddress,
} from '@island.is/clients/national-registry-v2'
import { GetCompanyApi } from '@island.is/clients/rsk/company-registry'
import { UserProfileApi } from '@island.is/clients/user-profile'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

import { UserProfileDTO } from '../entities/dto/user-profile.dto'
import type { GenderValue } from '../entities/dto/user-profile.dto'
import { AddressDTO } from '../entities/dto/address.dto'
import { FetchError } from '@island.is/clients/middlewares'

@Injectable()
export class UserProfileService {
  constructor(
    private individualClient: NationalRegistryClientService,
    private userProfileApi: UserProfileApi,
    private companyRegistryApi: GetCompanyApi,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfileClaims(auth: User): Promise<UserProfileDTO> {
    // TODO: Switch to `kennitala` package after it releases 2.0.0 with temporary id support.
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
    const is404 = (error as FetchError).status === 404
    if (!is404) {
      this.logger.error(error)
    }
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
    const individual = await this.individualClient.getIndividual(
      auth.nationalId,
    )
    if (!individual) {
      return {}
    }

    return {
      name: individual.name,
      givenName: individual.givenName ?? undefined,
      familyName: individual.familyName ?? undefined,
      middleName: individual.middleName ?? undefined,
      gender: this.formatGender(individual.genderCode),
      address: this.formatAddress(
        individual.residence ?? individual.legalDomicile,
      ),
      legalDomicile: this.formatAddress(individual.legalDomicile),
      birthdate: this.formatBirthdate(individual.birthdate),
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

  private formatAddress(
    address: NationalRegistryAddress | null,
  ): AddressDTO | undefined {
    if (!address) {
      return undefined
    }

    const likelyForeign =
      address.streetAddress != null &&
      address.locality == null &&
      address.postalCode == null &&
      address.municipalityNumber == null
    if (likelyForeign) {
      // When individuals live abroad, the national registry stores the country name under "heiti".
      return {
        country: address.streetAddress,
      }
    }

    return {
      formatted: this.formattedAddressString(address),
      streetAddress: address.streetAddress ?? undefined,
      locality: address.locality ?? undefined,
      postalCode: address.postalCode ?? undefined,
    }
  }

  private formattedAddressString(
    address: NationalRegistryAddress,
  ): string | undefined {
    const icelandicAddress =
      address.streetAddress &&
      address.locality &&
      address.postalCode &&
      address.municipalityNumber

    if (icelandicAddress) {
      return `${address.streetAddress}\n${address.postalCode} ${address.locality}\nÍsland`
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
