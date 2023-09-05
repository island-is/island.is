import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetFamilyInfoInput {
  @Field()
  @IsString()
  familyMemberNationalId!: string
}
