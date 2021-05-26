import { Field, ObjectType } from '@nestjs/graphql'
import { IsString, IsOptional, IsBoolean } from 'class-validator'

@ObjectType()
export class NewDrivingLicenseResult {
  @Field()
  success!: boolean

  @Field({ nullable: true })
  errorMessage!: string | null
}
