import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class GetFamilyInfoInout {
  @Field()
  @IsString()
  familyMemberNationalId!: string
}
