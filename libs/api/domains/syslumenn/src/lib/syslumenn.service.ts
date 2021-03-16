import { SyslumennClient } from './client/syslumenn.client'
import { Homestay, mapHomestay } from './models/homestay'
import { Injectable } from '@nestjs/common'
import { Person, Attachment } from './models/dataUpload'

@Injectable()
export class SyslumennService {
  constructor(private syslumennClient: SyslumennClient) {}

  async getHomestays(year?: number): Promise<Homestay[]> {
    const homestays = await this.syslumennClient.getHomestays(year)

    return (homestays ?? []).map(mapHomestay)
  }

  async uploadData(
    persons: Person[],
    attachement: Attachment,
    extraData: object,
  ): Promise<string> {
    return await this.syslumennClient.uploadData(
      persons,
      attachement,
      extraData,
    )
  }
}
