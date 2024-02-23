import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesV2Link')
export class Link {
  @Field()
  type!: 'file' | 'link'

  @Field()
  text!: string

  @Field()
  url!: string
}
