import { HTMLText, ISODate, PlainText, RegName } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class ChangeAppendix {
  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  text!: HTMLText
}

@ObjectType()
export class DraftRegulationChangeModel {
  @Field(() => String, { nullable: true })
  type!: string

  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  name!: RegName

  @Field(() => String, { nullable: true })
  title!: PlainText

  @Field(() => String, { nullable: true })
  regTitle!: string

  @Field(() => String, { nullable: true })
  date!: ISODate

  @Field(() => String, { nullable: true })
  text!: HTMLText

  @Field(() => [ChangeAppendix], { nullable: true })
  appendixes!: ChangeAppendix[]

  @Field(() => String, { nullable: true })
  comments!: HTMLText

  @Field(() => Boolean, { nullable: true })
  dropped?: boolean

  @Field(() => String, { nullable: true })
  diff?: HTMLText
}
