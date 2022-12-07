import { Injectable } from '@nestjs/common'
import { User } from '@island.is/auth-nest-tools'
import { VehicleCodetablesClient } from '@island.is/clients/transport-authority/vehicle-codetables'
import { VehicleOwnerChangeClient } from '@island.is/clients/transport-authority/vehicle-owner-change'
import { VehicleInfolocksClient } from '@island.is/clients/transport-authority/vehicle-infolocks'
import { DigitalTachographDriversCardClient } from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { VehiclePlateOrderingClient } from '@island.is/clients/transport-authority/vehicle-plate-ordering'
import { CheckTachoNetInput } from './graphql/dto'
import {
  OwnerChangeValidation,
  InsuranceCompany,
  QualityPhotoAndSignature,
  CheckTachoNetExists,
  NewestDriversCard,
  DeliveryStation,
} from './graphql/models'

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

  async validateVehicleForOwnerChange(
    user: User,
    permno: string,
  ): Promise<OwnerChangeValidation> {
    // Note: Will just use today's date, since we dont have the purchase date at this point
    const today = new Date()

    return await this.vehicleOwnerChangeClient.validateVehicleForOwnerChange(
      user,
      permno,
      today,
    )
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

  async getNewestDriversCard(user: User): Promise<NewestDriversCard> {
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
