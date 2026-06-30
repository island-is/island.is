import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySailorCertificateStatus } from './enums'

@ObjectType()
export class ShipRegistrySailorSchoolCertificate {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  title?: string

  @Field({ nullable: true })
  school?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  issueDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validToDate?: Date

  @Field(() => ShipRegistrySailorCertificateStatus)
  status!: ShipRegistrySailorCertificateStatus
}
