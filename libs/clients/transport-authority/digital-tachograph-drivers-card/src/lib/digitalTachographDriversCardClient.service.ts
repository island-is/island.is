import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { DriverCardsApiApi, IndividualApiApi } from '../../gen/fetch/apis'
import {
  DeliveryMethodEnum,
  IsActiveEnum,
  IsValidEnum,
} from '../../gen/fetch/models'
import {
  DriversCardApplicationRequest,
  NewestDriversCard,
  IndividualPhotoAndSignature,
  TachoNetCheckRequest,
} from './digitalTachographDriversCardClient.types'

@Injectable()
export class DigitalTachographDriversCardClient {
  constructor(
    private readonly driversCardApi: DriverCardsApiApi,
    private readonly individualApi: IndividualApiApi,
  ) {}

  private driversCardApiWithAuth(auth: Auth) {
    return this.driversCardApi.withMiddleware(new AuthMiddleware(auth))
  }

  private individualApiWithAuth(auth: Auth) {
    return this.individualApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async checkIfHasActiveCardInTachoNet(
    auth: User,
    request: TachoNetCheckRequest,
  ): Promise<boolean> {
    const result = await this.driversCardApiWithAuth(
      auth,
    ).v1DrivercardsTachonetcheckPost({
      tachonetCheckRequest: {
        firstName: request.firstName,
        lastName: request.lastName,
        birthDate: request.birthDate,
        birthPlace: request.birthPlace,
        drivingLicenceNumber: request.drivingLicenceNumber,
        drivingLicenceIssuingCountry: request.drivingLicenceIssuingCountry,
      },
    })

    return !!result.cards?.find((x) => x.isActive === IsActiveEnum.Yes)
  }

  public async getNewestDriversCard(auth: User): Promise<NewestDriversCard> {
    const result = await this.driversCardApiWithAuth(
      auth,
    ).v1DrivercardsPersidnoNewestGet({
      persidno: auth.nationalId,
    })

    return {
      ssn: result?.personIdNumber || undefined,
      applicationCreatedAt: result?.datetimeOfApplication || undefined,
      cardNumber: result?.cardNumber || undefined,
      cardValidFrom: result?.cardValidFromDatetime || undefined,
      cardValidTo: result?.cardValidToDatetime || undefined,
      isValid: result?.isValid === IsValidEnum.Yes,
    }
  }

  public async saveDriversCard(
    auth: User,
    request: DriversCardApplicationRequest,
  ): Promise<void> {
    const result = await this.driversCardApiWithAuth(auth).v1DrivercardsPost({
      driverCardApplicationRequest: {
        personIdNumber: request.ssn,
        fullName: request.fullName,
        address: request.address,
        postalCode: request.postalCode,
        place: request.place,
        birthCountry: request.birthCountry,
        birthPlace: request.birthPlace,
        emailAddress: request.emailAddress,
        phoneNumber: request.phoneNumber,
        deliveryMethod: request.deliveryMethodIsSend
          ? DeliveryMethodEnum.Send
          : DeliveryMethodEnum.PickUp,
        paymentDatetime: request.paymentReceivedAt,
        photo: request.photo,
        signature: request.signature,
      },
    })
  }

  public async getPhotoAndSignature(
    auth: User,
  ): Promise<IndividualPhotoAndSignature> {
    const result = await this.individualApiWithAuth(
      auth,
    ).v1IndividualPersidnoPhotoandsignatureGet({
      persidno: auth.nationalId,
    })

    return {
      ssn: result.personIdNumber,
      photo: result.photo,
      signature: result.signature,
    }
  }
}
