import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import { Juristiction, QualityPhotoResult } from './pMark.type'
import { PMarkApi } from '@island.is/clients/p-mark'
import { BLACKLISTED_JURISTICTION } from './util/constants'

@Injectable()
export class PMarkService {
  constructor(private readonly pMarkApi: PMarkApi) {}

  async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.pMarkApi.getListOfJuristictions()

    return embaetti.filter(({ id }) => id !== BLACKLISTED_JURISTICTION)
  }

  async getQualityPhoto(
    nationalId: User['nationalId'],
  ): Promise<QualityPhotoResult> {
    const hasQualityPhoto = await this.pMarkApi.getHasQualityPhoto({
      nationalId,
    })
    const image = hasQualityPhoto
      ? await this.pMarkApi.getQualityPhoto({
          nationalId,
        })
      : null

    return {
      success: hasQualityPhoto,
      qualityPhoto: image?.data ?? null,
      errorMessage: null,
    }
  }
}
