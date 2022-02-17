import { HTMLText, ISODate, RegName } from '@island.is/regulations'
import { Field, ObjectType } from '@nestjs/graphql'
import { Appendix } from './draftRegulation.model'

@ObjectType()
export class DraftRegulationChangeModel {
  @Field(() => String, { nullable: true })
  type!: string

  @Field(() => String, { nullable: true })
  id!: string

  @Field(() => String, { nullable: true })
  name!: RegName

  @Field(() => String, { nullable: true })
  title!: string

  @Field(() => String, { nullable: true })
  date!: ISODate

  @Field(() => String, { nullable: true })
  text?: HTMLText

  @Field(() => [Appendix], { nullable: true })
  appendixes!: Appendix[]
}
