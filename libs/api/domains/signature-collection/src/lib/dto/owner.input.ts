import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class OwnerInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  name!: string

  @Field()
  @IsString()
  phone?: string

  @Field()
  @IsString()
  email?: string
}
