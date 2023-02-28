import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class FamilyCorrectionInput {
  @Field()
  @IsString()
  nationalIdChild!: string

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
