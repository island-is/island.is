import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleInfolocksClient } from '@island.is/clients/transport-authority/vehicle-infolocks'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { OwnerChangeAnswers, CheckTachoNetInput } from './graphql/dto'
import {
  OwnerChangeValidation,
  InsuranceCompany,
  QualityPhotoAndSignature,
  CheckTachoNetExists,
  NewestDriversCard,
  DeliveryStation,
} from './graphql/models'
import { TransferOfVehicleOwnershipAnswers } from '@island.is/application/templates/transport-authority/transfer-of-vehicle-ownership'

@Injectable()
export class TransportAuthorityApi {
  constructor(
    private readonly vehicleOwnerChangeClient: VehicleOwnerChangeClient,
    private readonly vehicleCodetablesClient: VehicleCodetablesClient,
    private readonly vehicleInfolocksClient: VehicleInfolocksClient,
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly drivingLicenseApi: DrivingLicenseApi,
    private readonly vehiclePlateOrderingClient: VehiclePlateOrderingClient,
  ) {}

  async validateApplicationForOwnerChange(
    user: User,
    answers: OwnerChangeAnswers,
  ): Promise<OwnerChangeValidation | null> {
    // No need to continue with this validation in user is neither seller nor buyer
    // (only time application data changes is on state change from these roles)
    const sellerSsn = answers?.seller?.nationalId
    const buyerSsn = answers?.buyer?.nationalId
    if (user.nationalId !== sellerSsn && user.nationalId !== buyerSsn) {
      return null
    }

    const buyerCoOwners = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'coOwner',
    )
    const buyerOperators = answers?.buyerCoOwnerAndOperator?.filter(
      (x) => x.type === 'operator',
    )

    const result = await this.vehicleOwnerChangeClient.validateAllForOwnerChange(
      user,
      {
        permno: answers?.vehicle?.plate,
        seller: {
          ssn: sellerSsn,
          email: answers?.seller?.email,
        },
        buyer: {
          ssn: buyerSsn,
          email: answers?.buyer?.email,
        },
        dateOfPurchase: new Date(answers?.vehicle?.date),
        saleAmount: Number(answers?.vehicle?.salePrice || '0') || 0,
        insuranceCompanyCode: answers?.insurance?.value || '',
        coOwners: buyerCoOwners?.map((coOwner) => ({
          ssn: coOwner.nationalId,
          email: coOwner.email,
        })),
        operators: buyerOperators?.map((operator) => ({
          ssn: operator.nationalId,
          email: operator.email,
          isMainOperator:
            buyerOperators.length > 1
              ? operator.nationalId === answers?.buyerMainOperator?.nationalId
              : true,
        })),
      },
    )

    return result
  }

  async getInsuranceCompanies(): Promise<InsuranceCompany[]> {
    return await this.vehicleCodetablesClient.getInsuranceCompanies()
  }

  async getAnonymityStatus(user: User): Promise<Boolean> {
    const result = await this.vehicleInfolocksClient.getAnonymityStatus(user)
    return result?.isChecked || false
  }

  async checkTachoNet(
    user: User,
    input: CheckTachoNetInput,
  ): Promise<CheckTachoNetExists> {
    const hasActiveCard = await this.digitalTachographDriversCardClient.checkIfHasActiveCardInTachoNet(
      user,
      input,
    )

    return { exists: hasActiveCard }
  }

  async getNewestDriversCard(user: User): Promise<NewestDriversCard | null> {
    return await this.digitalTachographDriversCardClient.getNewestDriversCard(
      user,
    )
  }

  async getPhotoAndSignature(user: User): Promise<QualityPhotoAndSignature> {
    // First we'll check if photo and signature exists in RLS database
    const hasQualityPhotoRLS = await this.drivingLicenseApi.getHasQualityPhoto({
      nationalId: user.nationalId,
    })
    const hasQualitySignatureRLS = await this.drivingLicenseApi.getHasQualitySignature(
      {
        nationalId: user.nationalId,
      },
    )
    if (hasQualityPhotoRLS && hasQualitySignatureRLS) {
      const photo = await this.drivingLicenseApi.getQualityPhoto({
        nationalId: user.nationalId,
      })
      const signature = await this.drivingLicenseApi.getQualitySignature({
        nationalId: user.nationalId,
      })

      return {
        hasPhoto: true,
        photoDataUri: this.getUriFromImageStr(photo?.data),
        hasSignature: true,
        signatureDataUri: this.getUriFromImageStr(signature?.data),
      }
    }

    // If not we need to check the SGS database
    const qualityPhotoAndSignatureSGS = await this.digitalTachographDriversCardClient.getPhotoAndSignature(
      user,
    )
    if (
      qualityPhotoAndSignatureSGS?.photo &&
      qualityPhotoAndSignatureSGS?.signature
    ) {
      return {
        hasPhoto: true,
        photoDataUri: this.getUriFromImageStr(
          qualityPhotoAndSignatureSGS.photo,
        ),
        hasSignature: true,
        signatureDataUri: this.getUriFromImageStr(
          qualityPhotoAndSignatureSGS.signature,
        ),
      }
    }

    // Otherwise, we dont have a photo/signature to return
    return {
      hasPhoto: false,
      hasSignature: false,
    }
  }

  async getDeliveryStations(user: User): Promise<Array<DeliveryStation>> {
    return await this.vehiclePlateOrderingClient.getDeliveryStations(user)
  }

  private getUriFromImageStr(
    imageData: string | undefined | null,
  ): string | null {
    return imageData?.length
      ? `data:image/jpeg;base64,${imageData.substring(1, imageData.length - 1)}`
      : null
  }
}
