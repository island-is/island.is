import { Inject, Injectable } from '@nestjs/common'

import type { Auth, User } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  AddressDto as NationalRegistryAddress,
  NationalRegistryClientService,
} from '@island.is/clients/national-registry-v2'
import { CompanyRegistryClientService } from '@island.is/clients/rsk/company-registry'
import { UserProfileApi } from '@island.is/clients/user-profile'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import type { GenderValue } from '../entities/dto/user-profile.dto'
import { UserProfileDTO } from '../entities/dto/user-profile.dto'
import { AddressDTO } from '../entities/dto/address.dto'
import { FetchError } from '@island.is/clients/middlewares'

interface Address extends NationalRegistryAddress {
  country?: string
}

// REMOVE this after upgrading to TypeScript 4.5
type CountryFormatter = { of: (countryCode: string) => string }

@Injectable()
export class UserProfileService {
  // REMOVE these ignores after upgrading to TypeScript 4.5
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  countryFormatter: CountryFormatter = new Intl.DisplayNames(['is', 'en'], {
    type: 'region',
  })

  constructor(
    private individualClient: NationalRegistryClientService,
    private userProfileApi: UserProfileApi,
    private companyRegistryApi: CompanyRegistryClientService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  userProfileApiWithAuth(auth: Auth) {
    return this.userProfileApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getUserProfileClaims(
    auth: User,
    getUserProfileClaims: boolean,
  ): Promise<UserProfileDTO> {
    // TODO: Switch to `kennitala` package after it releases 2.0.0 with temporary id support.
    const isCompany = !!auth.nationalId.match(/^[4-7]\d{9}$/)

    if (isCompany) {
      return this.getClaimsFromCompanyRegistry(auth).catch(this.handleError)
    } else {
      return this.getIndividualUserProfileClaims(auth, getUserProfileClaims)
    }
  }

  async getIndividualUserProfileClaims(
    auth: User,
    getUserProfileClaims: boolean,
  ): Promise<UserProfileDTO> {
    const [nationalRegistryClaims, userProfileClaims] = await Promise.all([
      this.getClaimsFromNationalRegistry(auth).catch(this.handleError),
      getUserProfileClaims
        ? this.getClaimsFromUserProfile(auth).catch(this.handleError)
        : {},
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
    const companyInfo = await this.companyRegistryApi.getCompany(
      auth.nationalId,
    )

    if (!companyInfo) {
      return {}
    }

    const legalDomicile = this.formatAddress(
      companyInfo.legalDomicile ?? null,
      true,
    )
    const address =
      this.formatAddress(companyInfo.address ?? null, true) ?? legalDomicile
    return {
      name: companyInfo.name,
      address,
      legalDomicile,
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
    address: Address | null,
    hasCountryCode = false,
  ): AddressDTO | undefined {
    if (!address) {
      return undefined
    }

    // Take an address object from National Registry and Company Registry and try to make it consistent.
    // According to schemas and experience:
    //
    // The national registry only requires the "heiti" field and does not include a country field. If the person
    // lives abroad, the "heiti" field stores the country name and the other fields are empty.
    //
    // The company registry includes a country code field, but the quality of the fields is unknown, including
    // which fields are always set.

    let { streetAddress, country } = address as Partial<Address>
    const locality = address.locality ?? undefined
    const postalCode = address.postalCode ?? undefined
    let formatted = undefined
    const valid = streetAddress && locality && postalCode

    if (country && hasCountryCode) {
      country = this.countryFormatter.of(country)
    }

    // When individuals live abroad, the national registry stores the country name under "heiti" or streetAddress.
    const likelyForeign =
      streetAddress != null &&
      locality == null &&
      postalCode == null &&
      country == null
    if (likelyForeign) {
      country = streetAddress
      streetAddress = undefined
    }

    if (valid) {
      if (!country) {
        country = 'Ísland'
      }
      formatted = `${streetAddress}\n${postalCode} ${locality}\n${country}`
    }

    return {
      formatted,
      streetAddress,
      locality,
      postalCode,
      country,
    }
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
