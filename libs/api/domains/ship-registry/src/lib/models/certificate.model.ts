import { Field, ObjectType } from '@nestjs/graphql'
import { ShipRegistryCertificateStatus } from '../dto/certificate-status.enum'

@ObjectType('ShipRegistryCertificate')
export class ShipRegistryCertificate {
  @Field()
  name!: string

  @Field(() => ShipRegistryCertificateStatus)
  status!: ShipRegistryCertificateStatus

  @Field()
  issueDate!: string

  @Field()
  validToDate!: string

  @Field({ nullable: true })
  extensionDate?: string
}
