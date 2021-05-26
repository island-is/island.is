import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class NewDrivingLicenseResult {
  @Field()
  success!: boolean

  @Field({ nullable: true })
  errorMessage!: string | null
}
