import { Injectable } from '@nestjs/common'

//TODO implement this repo... this is just mock atm

@Injectable()
export class DocumentProviderRepository {
  // eslint-disable-next-line
  async getProvider(nationalId: string): Promise<string> {
    return 'test8953-6742-4780-9139-baab1f2cc214'
  }

  // eslint-disable-next-line
  async saveProvider(nationalId: string, providerId: string): Promise<boolean> {
    return true
  }
}
