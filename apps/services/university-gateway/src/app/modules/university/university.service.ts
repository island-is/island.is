import { Injectable } from '@nestjs/common'
import { UniversityResponse } from './model'
import { uuid } from 'uuidv4'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'

//TODOx connect with new university DB

@Injectable()
export class UniversityService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getUniversities(): Promise<UniversityResponse> {
    return {
      data: [
        {
          id: uuid(),
          nationalId: '0000001111',
        },
        {
          id: uuid(),
          nationalId: '1111112222',
        },
      ],
    }
  }
}
