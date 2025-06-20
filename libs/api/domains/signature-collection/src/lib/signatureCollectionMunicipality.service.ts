import { User } from '@island.is/auth-nest-tools'
import { SignatureCollectionMunicipalityClientService } from '@island.is/clients/signature-collection'
import { Injectable } from '@nestjs/common'
import { SignatureCollectionSuccess } from './models'

@Injectable()
export class SignatureCollectionMunicipalityService {
  constructor(
    private signatureCollectionClientService: SignatureCollectionMunicipalityClientService,
  ) {}

  async startMunicipalityCollection(
    user: User,
    electionId: string,
  ): Promise<SignatureCollectionSuccess> {
    return await this.signatureCollectionClientService.startMunicipalityCollection(
      user,
      electionId,
    )
  }
}
