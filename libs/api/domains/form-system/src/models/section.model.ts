import { Field, ObjectType, Int } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Screen as ScreenModel } from './screen.model'

@ObjectType('FormSystemSection')
export class Section {
  @Field(() => String)
  id!: string

  @Field(() => String, { nullable: true })
  identifier?: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => String, { nullable: true })
  sectionType?: string

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => LanguageType, { nullable: true })
  waitingText?: LanguageType

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => [ScreenModel], { nullable: 'itemsAndList' })
  screens?: ScreenModel[]
}
