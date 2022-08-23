import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class FamilyCorrectionInput {
  @Field()
  @IsString()
  ssn!: string

  @Field()
  @IsString()
  ssnChild!: string

  @Field()
  @IsString()
  name!: string

  @Field()
  @IsString()
  phonenumber!: string

  @Field()
  @IsString()
  email!: string

  @Field()
  @IsString()
  comment!: string
}
