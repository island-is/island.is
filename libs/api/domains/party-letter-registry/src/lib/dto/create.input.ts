import { Field, InputType } from '@nestjs/graphql'
import { IsString } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'

@InputType()
export class CreatePartyLetterDto {
  @Field()
  @IsString()
  partyLetter!: string

  @Field()
  @IsString()
  partyName!: string

  @Field(() => [String])
  @IsNationalId({ each: true })
  managers!: string[]
}
