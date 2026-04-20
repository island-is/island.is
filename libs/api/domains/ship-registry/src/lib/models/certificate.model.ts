import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql'
import { ShipRegistryCertificateStatus } from './enums'

@ObjectType()
export class ShipRegistryCertificate {
  @Field()
  name!: string

  @Field(() => ShipRegistryCertificateStatus)
  status!: ShipRegistryCertificateStatus

  @Field(() => GraphQLISODateTime)
  issueDate!: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validToDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  extensionDate?: Date
}
