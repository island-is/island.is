import { ISODate } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { IsOptional } from 'class-validator'

@InputType()
export class UpdateDraftRegulationCancelInput {
  @Field(() => String)
  id!: string

  @Field(() => Date, { nullable: true })
  @IsOptional()
  date?: ISODate
}
