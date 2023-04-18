import { TypesApi } from '@island.is/clients/consultation-portal'
import { Injectable } from '@nestjs/common'
import { AllTypesResult } from '../models/allTypesResult.model'

@Injectable()
export class TypesService {
  constructor(private typesApi: TypesApi) {}

  async getAllTypes(): Promise<AllTypesResult> {
    const types = await this.typesApi.apiTypesGet()
    return types
  }
}
