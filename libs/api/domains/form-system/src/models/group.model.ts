import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { LanguageType } from './global.model'
import { Input } from './input.model'

@ObjectType('FormSystemGroup')
export class Group {
  @Field(() => Int, { nullable: true })
  id?: number

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => ID, { nullable: true })
  guid?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => [Input], { nullable: 'itemsAndList' })
  inputs?: Input[] | null

  @Field(() => Int, { nullable: true })
  stepId?: number

  @Field(() => Int, { nullable: true })
  multiSet?: number

  @Field(() => String, { nullable: true })
  stepGuid?: string
}
