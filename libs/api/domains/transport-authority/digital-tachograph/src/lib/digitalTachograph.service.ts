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

@Injectable()
export class DigitalTachographApi {
  constructor(
    private readonly digitalTachographDriversCardClient: DigitalTachographDriversCardClient,
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
  ): Promise<PhotoAndSignatureResponse> {
    return this.digitalTachographDriversCardClient.getPhotoAndSignature(
      currentUserSsn,
    )
  }
}
