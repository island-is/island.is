import { Injectable } from '@nestjs/common'
import {
  RegistrationDto,
  Registration,
  RegistrationStatus,
} from './registration.model'
import { uuid } from 'uuidv4'
import { UgReykjavikUniversityClient } from '@island.is/clients/university-gateway/reykjavik-university'

// TODOx connect to ReykjavikUniversityClient and UniversityOfIcelandClient
@Injectable()
export class RegistrationService {
  constructor(
    private readonly ugReykjavikUniversityClient: UgReykjavikUniversityClient,
  ) {}

  async getRegistration(id: string): Promise<Registration> {
    return {
      id: id,
      status: RegistrationStatus.IN_PROGRESS,
      tbd: 'TBD',
    }
  }

  async postRegistration(
    registrationDto: RegistrationDto,
  ): Promise<Registration> {
    const updatedRegistration = {
      id: uuid(),
      status: registrationDto.status,
      tbd: registrationDto.tbd,
    }

    return updatedRegistration
  }

  async patchRegistration(
    id: string,
    registrationDto: RegistrationDto,
  ): Promise<Registration> {
    const updatedRegistration = { id: id, status: registrationDto.status }

    return updatedRegistration
  }
}
