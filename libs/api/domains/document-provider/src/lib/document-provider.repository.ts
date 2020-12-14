import { Injectable } from '@nestjs/common'

//TODO implement this repo... this is just mock atm

@Injectable()
export class DocumentProviderRepository {
  async getProvider(nationalId: string): Promise<string> {
    return 'test8953-6742-4780-9139-baab1f2cc214'
  }

  async saveProvider(nationalId: string, providerId: string): Promise<boolean> {
    return true
  }
}
