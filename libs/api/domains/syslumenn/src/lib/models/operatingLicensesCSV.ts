import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class OperatingLicensesCSV {
  @Field({ nullable: true })
  value?: string
}
