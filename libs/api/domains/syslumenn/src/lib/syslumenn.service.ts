import { SyslumennClient } from './client/syslumenn.client'
import { Homestay, mapHomestay } from './models/homestay'
import {
  SyslumennAuction,
  mapSyslumennAuction,
} from './models/syslumennAuction'
import { Injectable } from '@nestjs/common'
import { Person, Attachment, DataUploadResponse } from './models/dataUpload'

@Injectable()
export class SyslumennService {
  constructor(private syslumennClient: SyslumennClient) {}

  async getHomestays(year?: number): Promise<Homestay[]> {
    const homestays = await this.syslumennClient.getHomestays(year)

    return (homestays ?? []).map(mapHomestay)
  }

  async getSyslumennAuctions(): Promise<SyslumennAuction[]> {
    const syslumennAuctions = await this.syslumennClient.getSyslumennAuctions()

    return (syslumennAuctions ?? []).map(mapSyslumennAuction)
  }

  async uploadData(
    persons: Person[],
    attachement: Attachment,
    extraData: { [key: string]: string },
  ): Promise<DataUploadResponse> {
    return await this.syslumennClient.uploadData(
      persons,
      attachement,
      extraData,
    )
  }
}
