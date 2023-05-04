import { Major } from './ugReykjavikUniversityClient.types'
import { Injectable } from '@nestjs/common'
import { MajorsApi } from '../../gen/fetch'

@Injectable()
export class UgReykjavikUniversityClient {
  constructor(private majorsApi: MajorsApi) {}

  async getMajors(): Promise<Major[]> {
    const res = await this.majorsApi.majorsGetAllMajors({
      version: '2',
    })

    return res.map((major) => ({
      id: major.id,
      name: major.name,
    }))
  }
}
