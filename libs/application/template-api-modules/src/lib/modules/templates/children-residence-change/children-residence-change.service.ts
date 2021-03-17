import { Injectable, Inject } from '@nestjs/common'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  SyslumennService,
  Person,
  Attachment,
  PersonType,
} from '@island.is/api/domains/syslumenn'
import {
  CRCApplication,
  Override,
} from '@island.is/application/templates/children-residence-change'
import { User } from '@island.is/api/domains/national-registry'
import * as AWS from 'aws-sdk'

export const PRESIGNED_BUCKET = 'PRESIGNED_BUCKET'

type props = Override<
  TemplateApiModuleActionProps,
  { application: CRCApplication }
>

@Injectable()
export class ChildrenResidenceChangeService {
  s3: AWS.S3

  constructor(
    private readonly syslumennService: SyslumennService,
    @Inject(PRESIGNED_BUCKET) private readonly presignedBucket: string,
  ) {
    this.s3 = new AWS.S3()
  }

  // TODO: Send email to parents
  async submitApplication({ application }: props) {
    const { answers, externalData } = application
    const { parentNationalRegistry } = externalData
    const nationalRegistry = (externalData.nationalRegistry
      .data as unknown) as User
    const s3FileName = `children-residence-change/${application.id}.pdf`
    const file = await this.s3
      .getObject({ Bucket: this.presignedBucket, Key: s3FileName })
      .promise()
    const fileContent = file.Body?.toString('base64')

    const selectedChildren = application.externalData.childrenNationalRegistry.data.filter(
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
      phoneNumber: answers.parentA.phoneNumber,
      email: answers.parentA.email,
      homeAddress: nationalRegistry.address.streetAddress,
      postalCode: nationalRegistry.address.postalCode,
      city: nationalRegistry.address.city,
      signed: true,
      type: PersonType.Plaintiff,
    }

    const parentB: Person = {
      name: parentNationalRegistry.data.name,
      ssn: parentNationalRegistry.data.ssn,
      phoneNumber: answers.parentB.phoneNumber,
      email: answers.parentB.email,
      homeAddress: parentNationalRegistry.data.address,
      postalCode: parentNationalRegistry.data.postalCode,
      city: parentNationalRegistry.data.city,
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
