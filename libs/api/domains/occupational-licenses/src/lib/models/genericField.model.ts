import { ObjectType, Field } from '@nestjs/graphql'

@ObjectType('OccupationalLicensesGenericField')
export class GenericField {
  @Field()
  title!: string

  @Field()
  value!: string
}
