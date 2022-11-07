import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  DriverCardApplicationRequestDeliveryMethodEnum,
  DriverCardApplicationResponseDeliveryMethodEnum,
  NewestIcelandicDriverCardResponseIsValidEnum,
  TachonetCheckResponseCardsIsActiveEnum,
  TachonetCheckResponseCardsIsTemporaryEnum,
} from '../../gen/fetch'
import {
  TachoNetApi,
  DriverCardsApi,
  IndividualApi,
} from '../../gen/fetch/apis'
import {
  DriverCardApplicationResponse,
  DriversCardApplicationRequest,
  NewestDriversCard,
  PhotoAndSignatureResponse,
  TachoNetCheckRequest,
  TachoNetCheckResponse,
} from './digitalTachographDriversCardClient.types'

@Injectable()
export class DigitalTachographDriversCardClient {
  constructor(
    private readonly tachoNetApi: TachoNetApi,
    private readonly driversCardApi: DriverCardsApi,
    private readonly individualApi: IndividualApi,
  ) {}

  private tachoNetApiWithAuth(auth: Auth) {
    return this.tachoNetApi.withMiddleware(new AuthMiddleware(auth))
  }

  private driversCardApiWithAuth(auth: Auth) {
    return this.driversCardApi.withMiddleware(new AuthMiddleware(auth))
  }

  private individualApiWithAuth(auth: Auth) {
    return this.individualApi.withMiddleware(new AuthMiddleware(auth))
  }

  public async checkTachoNet(
    auth: User,
    request: TachoNetCheckRequest,
  ): Promise<TachoNetCheckResponse> {
    const result = await this.tachoNetApiWithAuth(auth).postTachonetcheck({
      tachonetCheckRequest: {
        firstName: request.firstName,
        lastName: request.lastName,
        birthDate: request.birthDate,
        birthPlace: request.birthPlace,
        drivingLicenceNumber: request.drivingLicenceNumber,
        drivingLicenceIssuingCountry: request.drivingLicenceIssuingCountry,
      },
    })

    return {
      firstName: result.firstName,
      lastName: result.lastName,
      birthDate: result.birthDate,
      birthPlace: result.birthPlace,
      drivingLicenceNumber: result.drivingLicenceNumber,
      drivingLicenceIssuingCountry: result.drivingLicenceIssuingCountry,
      cards: result.cards?.map((card) => ({
        countryName: card.countryName,
        cardNumber: card.cardNumber,
        cardValidFrom: card.cardValidFromDatetime,
        cardValidTo: card.cardValidToDatetime,
        issuingAuthority: card.issuingAuthority,
        isTemporary:
          card.isTemporary === TachonetCheckResponseCardsIsTemporaryEnum.Yes,
        isActive: card.isActive === TachonetCheckResponseCardsIsActiveEnum.Yes,
      })),
    }
  }

  public async getNewestDriversCard(auth: User): Promise<NewestDriversCard> {
    // TODOx disabled untill this API goes on xroad
    const validFrom = new Date()
    validFrom.setFullYear(validFrom.getFullYear() - 1)
    const validTo = new Date()
    validTo.setFullYear(validTo.getFullYear() + 1)
    return {
      ssn: auth.nationalId,
      applicationCreatedAt: validFrom,
      cardNumber: '123456',
      cardValidFrom: validFrom,
      cardValidTo: validTo,
      isValid: true,
    }

    const result = await this.driversCardApiWithAuth(
      auth,
    ).getNewesticelandicdrivercard({
      persidno: auth.nationalId,
    })

    return {
      ssn: result?.personIdNumber,
      applicationCreatedAt: result?.datetimeOfApplication,
      cardNumber: result?.cardNumber,
      cardValidFrom: result?.cardValidFromDatetime,
      cardValidTo: result?.cardValidToDatetime,
      isValid:
        result?.isValid === NewestIcelandicDriverCardResponseIsValidEnum.Yes,
    }
  }

  public async saveDriversCard(
    auth: User,
    request: DriversCardApplicationRequest,
  ): Promise<DriverCardApplicationResponse | null> {
    // TODOx disabled untill this API goes on xroad
    throw Error('Not implemented')
    return null

    const result = await this.driversCardApiWithAuth(auth).postDrivercards({
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
          ? DriverCardApplicationRequestDeliveryMethodEnum.Send
          : DriverCardApplicationRequestDeliveryMethodEnum.PickUp,
        paymentDatetime: request.paymentReceivedAt,
        photo: request.photo,
        signature: request.signature,
      },
    })

    return {
      ssn: result?.personIdNumber,
      applicationCreatedAt: result?.applicationDatetime,
      cardNumber: result?.cardNumber,
      cardValidFrom: result?.cardValidFromDatetime,
      cardValidTo: result?.cardValidToDatetime,
      deliveryMethodIsSend:
        result?.deliveryMethod ===
        DriverCardApplicationResponseDeliveryMethodEnum.Send,
      deliveryAddressIfSend:
        result?.deliveryMethod ===
        DriverCardApplicationResponseDeliveryMethodEnum.Send
          ? {
              recipientName: result?.deliveryIfSend?.recipientName,
              address: result?.deliveryIfSend?.address,
              postalCode: result?.deliveryIfSend?.postalCode,
              place: result?.deliveryIfSend?.place,
              country: result?.deliveryIfSend?.country,
            }
          : undefined,
    }
  }

  public async getPhotoAndSignature(
    auth: User,
  ): Promise<PhotoAndSignatureResponse> {
    const result = await this.individualApiWithAuth(
      auth,
    ).getIndividualPersidnoPhotoandsignature({
      persidno: auth.nationalId,
    })

    return {
      ssn: result.personIdNumber,
      photo: result.photo,
      signature: result.signature,
    }
  }
}
