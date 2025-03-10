import { CacheField } from '@island.is/nest/graphql'
import { Field, Int, ObjectType } from '@nestjs/graphql'
import { Document } from '@contentful/rich-text-types'
import graphqlTypeJson from 'graphql-type-json'
import { VerdictsInput } from './verdicts.input'

type Html = { __typename: string; document?: Document }

@ObjectType('WebVerdictJudge')
class VerdictJudge {
  @Field(() => String, { nullable: true })
  name?: string | null

  @Field(() => String, { nullable: true })
  title?: string | null
}

@ObjectType('WebVerdictItem')
class VerdictItem {
  @Field(() => String)
  id!: string

  @Field(() => String)
  title!: string

  @Field(() => String)
  court!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => Date, { nullable: true })
  verdictDate?: Date | null

  @CacheField(() => VerdictJudge, { nullable: true })
  presidentJudge?: VerdictJudge | null

  @CacheField(() => [String])
  keywords!: string[]

  @Field(() => String)
  presentings!: string
}

@ObjectType('WebVerdictsResponse')
export class VerdictsResponse {
  @CacheField(() => [VerdictItem])
  items!: VerdictItem[]

  @CacheField(() => VerdictsInput)
  input!: VerdictsInput

  @Field(() => Int)
  total!: number
}

@ObjectType('WebVerdictByIdItem')
class VerdictByIdItem {
  @Field(() => String, { nullable: true })
  pdfString?: string

  @CacheField(() => graphqlTypeJson, { nullable: true })
  richText?: Html | null

  @Field(() => String)
  title!: string

  @Field(() => String)
  court!: string

  @Field(() => String)
  caseNumber!: string

  @Field(() => Date, { nullable: true })
  verdictDate?: Date | null

  @CacheField(() => [String])
  keywords!: string[]

  @Field(() => String)
  presentings!: string
}

@ObjectType('WebVerdictByIdResponse')
export class VerdictByIdResponse {
  @CacheField(() => VerdictByIdItem)
  item!: VerdictByIdItem
}
