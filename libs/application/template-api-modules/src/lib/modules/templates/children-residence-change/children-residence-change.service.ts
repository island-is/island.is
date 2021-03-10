import { Injectable, Inject } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { AwsService } from '@island.is/application/file-service'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

@Injectable()
export class ChildrenResidenceChangeService {
  constructor(
    private readonly awsService: AwsService,
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
  ) {}

  // TODO: Senda email
  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.awsService.getFile(this.presignedBucket, s3FileName)
    const fileContent = file.Body?.toString('base64')

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    const attachment: Attachment = {
      name: `Lögheimilisbreyting-barns-${application.applicant}.pdf`,
      content: fileContent,
    }

    // TODO: Use application type once we have it and then use real values
    const parentA: Person = {
      name: application.name ?? '',
      ssn: '',
      phoneNumber: '',
      email: '',
      homeAddress: 'Borgartún 26',
      postalCode: '105',
      city: 'Reykjavík',
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: application.name ?? '',
      ssn: '',
      phoneNumber: '',
      email: '',
      homeAddress: 'Borgartún 29',
      postalCode: '105',
      city: 'Reykjavík',
      signed: true,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = [
      {
        name: 'childName',
        ssn: 'some ssn',
        homeAddress: parentA.homeAddress,
        postalCode: parentA.postalCode,
        city: parentA.city,
        signed: false,
        type: PersonType.Child,
      },
    ]

    participants.push(parentA, parentB)

    const response = await this.syslumennService.uploadData(
      participants,
      attachment,
    )

    return response
  }
}
