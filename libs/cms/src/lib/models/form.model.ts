import { Field, ObjectType, ID } from '@nestjs/graphql'
import GraphQLJSON from 'graphql-type-json'
import { CacheField } from '@island.is/nest/graphql'
import { SystemMetadata } from '@island.is/shared/types'
import { IForm } from '../generated/contentfulTypes'
import { FormField, mapFormField } from './formField.model'

@ObjectType()
export class Form {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  intro!: string

  @CacheField(() => GraphQLJSON, { nullable: true })
  defaultFieldNamespace?: {
    nameLabel?: string
    namePlaceholder?: string
    emailLabel?: string
    emailPlaceholder?: string
  } | null

  @CacheField(() => [FormField])
  fields?: Array<FormField>

  @Field()
  successText!: string

  @Field()
  aboutYouHeadingText?: string

  @Field()
  questionsHeadingText?: string

  @CacheField(() => FormField, { nullable: true })
  recipientFormFieldDecider?: FormField

  @Field(() => [String], { nullable: true })
  recipientList?: string[]

  @Field(() => String, { nullable: true })
  emailSubject?: string
}

export const mapForm = ({ sys, fields }: IForm): SystemMetadata<Form> => {
  let recipientList = fields.recipientList ?? []
  if (fields.recipient) recipientList = [fields.recipient]

  return {
    typename: 'Form',
    id: sys.id,
    title: fields.title ?? '',
    intro: fields.intro ?? '',
    defaultFieldNamespace:
      (fields.defaultFieldNamespace as Form['defaultFieldNamespace']) ?? {},
    fields: (fields.fields ?? []).map(mapFormField),
    successText: fields.successText ?? '',
    aboutYouHeadingText: fields.aboutYouHeadingText ?? '',
    questionsHeadingText: fields.questionsHeadingText ?? '',
    recipientFormFieldDecider: fields.recipientFormFieldDecider
      ? mapFormField(fields.recipientFormFieldDecider)
      : undefined,
    recipientList: recipientList,
    emailSubject: fields.emailSubject ?? '',
  }
}
