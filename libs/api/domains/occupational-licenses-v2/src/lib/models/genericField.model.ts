import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesV2GenericField')
export class GenericField {
  @Field()
  title!: string

  @Field()
  value!: string
}
