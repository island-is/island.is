import { Field, InputType } from '@nestjs/graphql'
import { IsBoolean, IsString } from 'class-validator'

@InputType()
export class EndorsementInput {
  @Field()
  @IsBoolean()
  showName!: boolean

  @Field()
  @IsString()
  email!: string
}
