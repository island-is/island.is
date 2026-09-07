import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

@InputType()
export class CustomsGeneralInput {
  @Field(() => String)
  @IsString()
  date!: string

  @Field(() => String)
  @IsString()
  system!: string
}

@InputType()
export class CustomsGeneralDagsInput {
  @Field(() => String)
  @IsString()
  date!: string
}
