import { Field, ObjectType, ID, Int } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

@ObjectType()
export class ApplicationTranslationGql {
  @Field(() => ID)
  id!: string

  @Field()
  namespace!: string

  @Field()
  messageKey!: string

  @Field()
  valueIs!: string

  @Field(() => String, { nullable: true })
  valueEn?: string | null

  @Field(() => String, { nullable: true })
  defaultMessage?: string | null

  @Field()
  isReviewed!: boolean

  @Field(() => String, { nullable: true })
  translatedBy?: string | null

  @Field(() => String, { nullable: true })
  reviewedBy?: string | null

  @Field()
  created!: string

  @Field()
  modified!: string
}

@ObjectType()
export class ApplicationTranslationStatus {
  @Field()
  namespace!: string

  @Field(() => Int)
  total!: number

  @Field(() => Int)
  translatedEn!: number

  @Field(() => Int)
  untranslatedEn!: number

  @Field(() => Int)
  reviewed!: number
}

@ObjectType()
export class AiTranslationResultGql {
  @Field(() => graphqlTypeJson)
  translations!: Record<string, string>
}

@ObjectType()
export class MessageDescriptorGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  defaultMessage?: string

  @Field(() => String, { nullable: true })
  description?: string
}

@ObjectType()
export class ScreenIntrospectionGql {
  @Field()
  id!: string

  @Field()
  type!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [MessageDescriptorGql])
  messageDescriptors!: MessageDescriptorGql[]

  @Field(() => [ScreenIntrospectionGql], { nullable: true })
  children?: ScreenIntrospectionGql[]
}

@ObjectType()
export class SubSectionIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [ScreenIntrospectionGql])
  screens!: ScreenIntrospectionGql[]
}

@ObjectType()
export class SectionIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [SubSectionIntrospectionGql])
  subSections!: SubSectionIntrospectionGql[]

  @Field(() => [ScreenIntrospectionGql])
  screens!: ScreenIntrospectionGql[]
}

@ObjectType()
export class FormIntrospectionGql {
  @Field()
  id!: string

  @Field(() => String, { nullable: true })
  title?: string | null

  @Field(() => [SectionIntrospectionGql])
  sections!: SectionIntrospectionGql[]
}

@ObjectType()
export class RoleIntrospectionGql {
  @Field()
  roleId!: string

  @Field(() => FormIntrospectionGql, { nullable: true })
  form?: FormIntrospectionGql | null
}

@ObjectType()
export class StateIntrospectionGql {
  @Field()
  stateKey!: string

  @Field()
  stateName!: string

  @Field()
  status!: string

  @Field(() => [RoleIntrospectionGql])
  roles!: RoleIntrospectionGql[]
}

@ObjectType()
export class TemplateIntrospectionGql {
  @Field()
  typeId!: string

  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => [String])
  translationNamespaces!: string[]

  @Field(() => [StateIntrospectionGql])
  states!: StateIntrospectionGql[]

  @Field(() => [MessageDescriptorGql])
  allMessageDescriptors!: MessageDescriptorGql[]
}

@ObjectType()
export class TemplateListItemGql {
  @Field()
  typeId!: string

  @Field()
  name!: string

  @Field()
  slug!: string

  @Field(() => [String])
  translationNamespaces!: string[]
}
