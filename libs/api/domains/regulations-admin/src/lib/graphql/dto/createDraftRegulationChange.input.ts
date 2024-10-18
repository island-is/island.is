import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
class CreateChangeAppendixInput {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}
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

  @Field(() => [CreateChangeAppendixInput], { nullable: true })
  appendixes?: CreateChangeAppendixInput[]

  @Field(() => String, { nullable: true })
  date!: ISODate

  @Field(() => String, { nullable: true })
  comments!: HTMLText

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}
