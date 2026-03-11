import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('ShipRegistryCertificate')
export class ShipRegistryCertificate {
  @Field()
  name!: string

  @Field()
  status!: string

  @Field()
  issueDate!: string

  @Field()
  validToDate!: string

  @Field({ nullable: true })
  extensionDate?: string
}
