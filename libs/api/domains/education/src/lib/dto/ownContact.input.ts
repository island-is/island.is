import { Field, InputType } from '@nestjs/graphql'
import { IsOptional, IsString } from 'class-validator'

@InputType('EducationUpdateOwnContactInput')
export class UpdateOwnContactInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  email?: string | null

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  phone?: string | null
}
