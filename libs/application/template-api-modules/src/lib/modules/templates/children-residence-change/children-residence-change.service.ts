import { Injectable, Inject } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import { AwsService } from '@island.is/application/file-service'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'
import {
  CRCApplication,
  Override,
} from 'libs/application/templates/children-residence-change/src/types'
import { User } from '@island.is/api/domains/national-registry'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService {
  constructor(
    private readonly awsService: AwsService,
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
  ) {}

  // TODO: Send email to parents
  async submitApplication({ application }: props) {
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.awsService.getFile(this.presignedBucket, s3FileName)
    const fileContent = file.Body?.toString('base64')
    const nationalRegistry = (application.externalData.nationalRegistry
      .data as unknown) as User

    // TODO: Remove ternary for usemocks once we move mock data to externalData
    const selectedChildren =
      application.answers.useMocks === 'no'
        ? application.externalData.childrenNationalRegistry.data.filter((c) =>
            application.answers.selectChild.includes(c.name),
          )
        : application.answers.mockData.childrenNationalRegistry.data.filter(
            (c) => application.answers.selectChild.includes(c.name),
          )

    if (!fileContent) {
      throw new Error('File content was undefined')
    }

    const attachment: Attachment = {
      name: `Lögheimilisbreyting-barns-${nationalRegistry.nationalId}.pdf`,
      content: fileContent,
    }

    const parentA: Person = {
      name: nationalRegistry.fullName,
      ssn: nationalRegistry.nationalId,
      phoneNumber: application.answers.parentA.phoneNumber,
      email: application.answers.parentA.email,
      homeAddress: nationalRegistry.address.streetAddress,
      postalCode: nationalRegistry.address.postalCode,
      city: nationalRegistry.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: application.externalData.parentNationalRegistry.data.name,
      ssn: application.externalData.parentNationalRegistry.data.ssn,
      phoneNumber: application.answers.parentB.phoneNumber,
      email: application.answers.parentB.email,
      homeAddress: application.externalData.parentNationalRegistry.data.address,
      postalCode:
        application.externalData.parentNationalRegistry.data.postalCode,
      city: application.externalData.parentNationalRegistry.data.city,
      signed: true,
      type: PersonType.CounterParty,
    }

    const participants: Array<Person> = selectedChildren.map((child) => {
      return {
        name: child.name,
        ssn: child.ssn,
        homeAddress: child.address,
        postalCode: child.postalCode,
        city: child.city,
        signed: false,
        type: PersonType.Child,
      }
    })

    participants.push(parentA, parentB)

    const response = await this.syslumennService.uploadData(
      participants,
      attachment,
    )

    return response
  }
}
