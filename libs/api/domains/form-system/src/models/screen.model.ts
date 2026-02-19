import { Field, ObjectType, Int } from '@nestjs/graphql'
import { LanguageType } from './languageType.model'
import { Field as FieldModel } from './field.model'
import { ValidationError } from './applications.model'

@ObjectType('FormSystemScreen')
export class Screen {
  @Field(() => String)
  id!: string

  @Field(() => String)
  identifier!: string

  @Field(() => String)
  sectionId!: string

  @Field(() => LanguageType, { nullable: true })
  name?: LanguageType

  @Field(() => Int, { nullable: true })
  displayOrder?: number

  @Field(() => Boolean, { nullable: true })
  isHidden?: boolean

  @Field(() => Boolean, { nullable: true })
  isCompleted?: boolean

  @Field(() => Int, { nullable: true })
  multiset?: number

  @Field(() => Boolean, { nullable: true })
  shouldValidate?: boolean

  @Field(() => Boolean, { nullable: true })
  shouldPopulate?: boolean

  @Field(() => ValidationError, { nullable: true })
  screenError?: ValidationError

  @Field(() => [FieldModel], { nullable: 'itemsAndList' })
  fields?: FieldModel[]
}

@ObjectType('FormSystemNotificationResponse')
export class NotificationResponse {
  @Field(() => Screen, { nullable: true })
  screen?: Screen
}
