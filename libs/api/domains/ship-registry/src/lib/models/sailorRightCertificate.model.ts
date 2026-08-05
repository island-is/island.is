import { Field, GraphQLISODateTime, ID, ObjectType } from '@nestjs/graphql'
import { ShipRegistrySailorCertificateStatus } from './enums'

@ObjectType()
export class ShipRegistrySailorRightCertificate {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  rightsCategories?: string

  @Field({ nullable: true })
  certificateNumber?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  issueDate?: Date

  @Field(() => GraphQLISODateTime, { nullable: true })
  validToDate?: Date

  @Field(() => ShipRegistrySailorCertificateStatus)
  status!: ShipRegistrySailorCertificateStatus
}
