import { Injectable } from '@nestjs/common'
import { Juristiction, QualityPhoto } from '..'
import { ApiV1, EmbaettiDto } from '../v1'
import { ApiV2 } from '../v2'

@Injectable()
export class PMarkApi {
  constructor(private readonly v1: ApiV1, private readonly v2: ApiV2) {}

  public async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.v1.apiOkuskirteiniEmbaettiGet({})

    return embaetti.map(({ nr, postnumer, nafn }: EmbaettiDto) => ({
      id: nr || 0,
      zip: postnumer || 0,
      name: nafn || '',
    }))
  }

  async getHasQualityPhoto(params: { nationalId: string }): Promise<boolean> {
    const result = await this.v1.apiOkuskirteiniKennitalaHasqualityphotoGet({
      kennitala: params.nationalId,
    })

    return result > 0
  }

  async getQualityPhoto(params: {
    nationalId: string
  }): Promise<QualityPhoto | null> {
    const image = await this.v1.apiOkuskirteiniKennitalaGetqualityphotoGet({
      kennitala: params.nationalId,
    })

    return {
      data: image,
    }
  }
}
