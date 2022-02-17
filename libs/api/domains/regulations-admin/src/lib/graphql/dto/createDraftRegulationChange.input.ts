import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'
import { Appendix } from './editDraftRegulation.input'

@InputType()
export class CreateDraftRegulationChangeInput {
  @Field(() => String)
  changingId!: string

  @Field(() => String)
  regulation!: RegName

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => [Appendix], { nullable: true })
  appendixes?: Appendix[]

  @Field(() => String, { nullable: true })
  date!: ISODate
}
