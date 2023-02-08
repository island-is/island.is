import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IForm } from '../generated/contentfulTypes'
import { FormField, mapFormField } from './formField.model'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class Form {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  intro!: string

  @Field(() => [FormField])
  fields?: Array<FormField>

  @Field()
  successText!: string

  @Field()
  aboutYouHeadingText?: string

  @Field()
  questionsHeadingText?: string

  @Field(() => FormField, { nullable: true })
  recipientFormFieldDecider?: FormField

  @Field(() => [String], { nullable: true })
  recipientList?: string[]
}

export const mapForm = ({ sys, fields }: IForm): SystemMetadata<Form> => {
  let recipientList = fields.recipientList ?? []
  if (fields.recipient) recipientList = [fields.recipient]

  return {
    typename: 'Form',
    id: sys.id,
    title: fields.title ?? '',
    intro: fields.intro ?? '',
    fields: (fields.fields ?? []).map(mapFormField),
    successText: fields.successText ?? '',
    aboutYouHeadingText: fields.aboutYouHeadingText ?? '',
    questionsHeadingText: fields.questionsHeadingText ?? '',
    recipientFormFieldDecider: fields.recipientFormFieldDecider
      ? mapFormField(fields.recipientFormFieldDecider)
      : undefined,
    recipientList: recipientList,
  }
}
