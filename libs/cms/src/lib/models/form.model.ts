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

  @Field()
  recipient!: string

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
}

export const mapForm = ({ sys, fields }: IForm): SystemMetadata<Form> => ({
  typename: 'Form',
  id: sys.id,
  title: fields.title ?? '',
  intro: fields.intro ?? '',
  recipient: fields.recipient ?? '',
  fields: (fields.fields ?? []).map(mapFormField),
  successText: fields.successText ?? '',
  aboutYouHeadingText: fields.aboutYouHeadingText ?? '',
  questionsHeadingText: fields.questionsHeadingText ?? '',
  recipientFormFieldDecider: fields.recipientFormFieldDecider
    ? mapFormField(fields.recipientFormFieldDecider)
    : undefined,
})
