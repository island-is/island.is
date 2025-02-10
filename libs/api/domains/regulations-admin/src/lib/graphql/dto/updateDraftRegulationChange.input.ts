import { HTMLText, ISODate, PlainText } from '@island.is/regulations'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
class UpdateChangeAppendixInput {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}

@InputType()
export class UpdateDraftRegulationChangeInput {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => [UpdateChangeAppendixInput], { nullable: true })
  appendixes?: UpdateChangeAppendixInput[]

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  date!: ISODate

  @Field(() => String, { nullable: true })
  comments!: HTMLText

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}
