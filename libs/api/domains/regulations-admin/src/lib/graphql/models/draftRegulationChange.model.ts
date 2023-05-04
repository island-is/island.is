import { HTMLText, PlainText, RegName } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class ChangeAppendix {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@ObjectType()
export class DraftRegulationChangeModel {
  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  name?: RegName | 'self'

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  regTitle?: string

  @Field(() => String, { nullable: true })
  date?: string

  @Field(() => String, { nullable: true })
  text!: string

  @Field(() => [ChangeAppendix], { nullable: true })
  appendixes?: Array<ChangeAppendix>

  @Field(() => String, { nullable: true })
  comments!: HTMLText

  @Field(() => Boolean, { nullable: true })
  dropped?: boolean

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}
