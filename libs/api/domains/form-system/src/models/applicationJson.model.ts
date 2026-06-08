import { Field, Int, ObjectType } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { LanguageType } from './languageType.model'
import { Value } from './value.model'

@ObjectType('FormSystemApplicationJsonValue')
export class ApplicationJsonValue {
  @Field(() => Int)
  order!: number

  @Field(() => Value)
  json!: Value
}

@ObjectType('FormSystemApplicationJsonFieldSettings')
export class ApplicationJsonFieldSettings {
  @Field(() => Boolean, { nullable: true })
  isDecimal?: boolean

  @Field(() => String, { nullable: true })
  applicantType?: string
}

@ObjectType('FormSystemApplicationJsonField')
export class ApplicationJsonField {
  @Field(() => String)
  identifier!: string

  @Field(() => String)
  screenIdentifier!: string

  @Field(() => String)
  fieldType!: string

  @Field(() => ApplicationJsonFieldSettings, { nullable: true })
  fieldSettings?: ApplicationJsonFieldSettings

  @Field(() => [ApplicationJsonValue])
  values!: ApplicationJsonValue[]
}

@ObjectType('FormSystemApplicationJson')
export class ApplicationJson {
  @Field(() => String)
  id!: string

  @Field(() => String)
  slug!: string

  @Field(() => Boolean)
  isTest!: boolean

  @Field(() => String)
  status!: string

  @Field(() => Date, { nullable: true })
  submittedAt?: Date | null

  @Field(() => [ApplicationJsonField])
  fields!: ApplicationJsonField[]
}
