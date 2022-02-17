import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { Appendix } from './editDraftRegulation.input'

@InputType()
export class UpdateDraftRegulationChangeInput {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => [Appendix], { nullable: true })
  appendixes?: Appendix[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  date!: ISODate
}
