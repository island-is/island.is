import { Injectable } from '@nestjs/common'
import { generateResidenceChangePdf } from './utils/pdf'

@Injectable()
export class FileService {
  constructor(
  ) {}

  async createResidenceChangePdf(
    childrenAppliedFor: [{name: string, ssn: string}],
    parentA: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
    parentB: {name: string, ssn: string, phoneNumber: string, email:string, homeAddress: string, postalCode: string, city: string},
    expiry: string
    ): Promise<string> {
    return await generateResidenceChangePdf(childrenAppliedFor, parentA, parentB, expiry)
  }
}
