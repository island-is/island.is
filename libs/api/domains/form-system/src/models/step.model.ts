import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'
import { Group } from './group.model'

@ObjectType('FormSystemStep')
export class Step {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Number, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType

  @Field(() => Boolean, { nullable: true })
  callRuleset?: boolean

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [Group], { nullable: 'itemsAndList' })
  groups?: Group[] | null
}
