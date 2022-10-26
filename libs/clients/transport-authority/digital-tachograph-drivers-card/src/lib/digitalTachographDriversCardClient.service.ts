import { Injectable } from '@nestjs/common'
import { fail } from 'assert'
import { map } from 'rxjs'
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

  public async checkTachoNet(
    request: TachoNetCheckRequest,
  ): Promise<TachoNetCheckResponse> {
    const result = await this.tachoNetApi.postTachonetcheck({
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

  public async getNewestDriversCard(ssn: string): Promise<NewestDriversCard> {
    // TODOx disabled untill this API goes on xroad
    const validFrom = new Date()
    validFrom.setFullYear(validFrom.getFullYear() - 1)
    const validTo = new Date()
    validTo.setFullYear(validTo.getFullYear() + 1)
    return {
      ssn: ssn,
      applicationCreatedAt: validFrom,
      cardNumber: '123456',
      cardValidFrom: validFrom,
      cardValidTo: validTo,
      isValid: true,
    }

    const result = await this.driversCardApi.getNewesticelandicdrivercard({
      persidno: ssn,
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
    request: DriversCardApplicationRequest,
  ): Promise<DriverCardApplicationResponse | null> {
    // TODOx disabled untill this API goes on xroad
    throw Error('Not implemented')
    return null

    const result = await this.driversCardApi.postDrivercards({
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
    ssn: string,
  ): Promise<PhotoAndSignatureResponse> {
    const result = await this.individualApi.getIndividualPersidnoPhotoandsignature(
      {
        persidno: ssn,
      },
    )

    return {
      ssn: result.personIdNumber,
      photo: result.photo,
      signature: result.signature,
    }
  }
}
