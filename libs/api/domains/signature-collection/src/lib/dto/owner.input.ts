import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class SignatureCollectionOwnerInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field()
  @IsString()
  name!: string

  @Field({ nullable: true })
  @IsString()
  phone!: string

  @Field({ nullable: true })
  @IsString()
  email!: string
}
