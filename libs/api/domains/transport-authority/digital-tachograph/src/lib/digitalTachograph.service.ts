import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common'
import {
  DigitalTachographDriversCardClient,
  DriverCardApplicationResponse,
  DriversCard,
  DriversCardApplicationRequest,
  PhotoAndSignatureResponse,
  TachoNetCheckRequest,
  TachoNetCheckResponse,
} from '@island.is/clients/transport-authority/digital-tachograph-drivers-card'
import { User } from '@island.is/auth-nest-tools'
import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { QualityPhotoAndSignature } from './graphql/models'

@Injectable()
export class DigitalTachographApi {
  constructor(
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
    private readonly drivingLicenseApi: DrivingLicenseApi,
  ) {}

  async checkTachoNet(
    driversCardRequest: TachoNetCheckRequest,
  ): Promise<TachoNetCheckResponse> {
    return this.digitalTachographDriversCardClient.checkTachoNet(
      driversCardRequest,
    )
  }

  async getDriversCard(currentUserSsn: string): Promise<DriversCard> {
    return this.digitalTachographDriversCardClient.getDriversCard(
      currentUserSsn,
    )
  }

  async saveDriversCard(
    driversCardRequest: DriversCardApplicationRequest,
  ): Promise<DriverCardApplicationResponse | null> {
    return this.digitalTachographDriversCardClient.saveDriversCard(
      driversCardRequest,
    )
  }

  async getPhotoAndSignature(
    currentUserSsn: string,
  ): Promise<QualityPhotoAndSignature> {
    // First we'll check if photo and signature exists in RLS database
    const hasQualityPhotoRLS = await this.drivingLicenseApi.getHasQualityPhoto({
      nationalId: currentUserSsn,
    })
    const hasQualitySignatureRLS = await this.drivingLicenseApi.getHasQualitySignature(
      {
        nationalId: currentUserSsn,
      },
    )
    if (hasQualityPhotoRLS && hasQualitySignatureRLS) {
      const photo = await this.drivingLicenseApi.getQualityPhoto({
        nationalId: currentUserSsn,
      })
      const signature = await this.drivingLicenseApi.getQualitySignature({
        nationalId: currentUserSsn,
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
      currentUserSsn,
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
