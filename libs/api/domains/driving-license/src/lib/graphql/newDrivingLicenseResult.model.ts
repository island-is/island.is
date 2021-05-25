import { Field, ObjectType } from '@nestjs/graphql'
import { IsString, IsOptional, IsBoolean } from 'class-validator'

@ObjectType()
export class NewDrivingLicenseResult {
  @Field()
  @IsBoolean()
  success!: boolean

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  errorMessage!: string | null
}
