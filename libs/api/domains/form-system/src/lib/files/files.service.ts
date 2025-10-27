import { Logger } from '@azure/msal-node'
import { AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  FileControllerStoreFileToS3Request,
  FilesApi,
} from '@island.is/clients/form-system'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Inject, Injectable } from '@nestjs/common'
import { StoreFileInput } from '../../dto/files.input'

@Injectable()
export class FilesService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
    private filesApi: FilesApi,
  ) {}

  private filesApiWithAuth(auth: User) {
    return this.filesApi.withMiddleware(new AuthMiddleware(auth))
  }

  async storeFile(auth: User, input: StoreFileInput): Promise<void> {
    console.log('input controller', input)

    await this.filesApiWithAuth(auth).fileControllerStoreFileToS3(
      input as FileControllerStoreFileToS3Request,
    )
  }
}
