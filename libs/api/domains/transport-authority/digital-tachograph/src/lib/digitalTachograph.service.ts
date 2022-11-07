import { Injectable } from '@nestjs/common'
import {
  DigitalTachographDriversCardClient,
  DriverCardApplicationResponse,
  DriversCardApplicationRequest,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import {
  QualityPhotoAndSignature,
  CheckTachoNetExists,
  NewestDriversCard,
} from './graphql/models'
import { CheckTachoNetInput } from './graphql/dto'
import { User } from '@island.is/auth-nest-tools'

@Injectable()
export class DigitalTachographApi {
  constructor(
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly drivingLicenseApi: DrivingLicenseApi,
  ) {}

  async checkTachoNet(
    user: User,
    input: CheckTachoNetInput,
  ): Promise<CheckTachoNetExists> {
    const result = await this.digitalTachographDriversCardClient.checkTachoNet(
      user,
      input,
    )

    const activeCard = result?.cards?.find((x) => x.isActive)

    return { exists: !!activeCard }
  }

  async getNewestDriversCard(user: User): Promise<NewestDriversCard> {
    return await this.digitalTachographDriversCardClient.getNewestDriversCard(
      user,
    )
  }

  async saveDriversCard(
    user: User,
    driversCardRequest: DriversCardApplicationRequest,
  ): Promise<DriverCardApplicationResponse | null> {
    return await this.digitalTachographDriversCardClient.saveDriversCard(
      user,
      driversCardRequest,
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

  getUriFromImageStr(imageData: string | undefined | null): string | null {
    return imageData?.length
      ? `data:image/jpeg;base64,${imageData.substring(1, imageData.length - 1)}`
      : null
  }
}
