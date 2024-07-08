import { Inject, Injectable } from '@nestjs/common'
import {
  SyslumennService,
  MortgageCertificate,
  MortgageCertificateValidation,
  Person,
  PersonType,
} from '@island.is/clients/syslumenn'
import {
  Identity,
  Properties,
  RequestCorrection,
  UserProfile,
} from './mortgageCertificate.types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'

@Injectable()
export class MortgageCertificateService {
  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  async getMortgageCertificate(
    properties: Properties[],
  ): Promise<MortgageCertificate[]> {
    return await this.syslumennService.getMortgageCertificate(properties)
  }

  async validateMortgageCertificate(
    properties: Properties[],
  ): Promise<MortgageCertificateValidation[]> {
    return await this.syslumennService.validateMortgageCertificate(properties)
  }

  async requestCorrectionOnMortgageCertificate(
    propertyNumber: string,
    identityData: Identity,
    userProfileData: UserProfile,
  ): Promise<RequestCorrection> {
    const person: Person = {
      name: identityData?.name,
      ssn: identityData?.nationalId,
      phoneNumber: userProfileData?.mobilePhoneNumber,
      email: userProfileData?.email,
      homeAddress: identityData?.address?.streetAddress || '',
      postalCode: identityData?.address?.postalCode || '',
      city: identityData?.address?.city || '',
      signed: true,
      type: PersonType.MortgageCertificateApplicant,
    }

    const persons: Person[] = [person]

    const extraData: { [key: string]: string } = {
      propertyNumber: propertyNumber,
    }

    const uploadDataName =
      'Umsókn um lagfæringu á veðbókarvottorði frá Ísland.is'
    const uploadDataId = 'VedbokavottordVilla1.0'

    try {
      const res = await this.syslumennService.uploadData(
        persons,
        undefined,
        extraData,
        uploadDataName,
        uploadDataId,
      )

      return {
        hasSentRequest: res.success,
      }
    } catch (error) {
      this.logger.error(
        'Error sending mortgage certificate to Sýslumenn',
        error,
        propertyNumber,
        identityData,
        userProfileData,
      )
      return {
        hasSentRequest: false,
      }
    }
  }
}
