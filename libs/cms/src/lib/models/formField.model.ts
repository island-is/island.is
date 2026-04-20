import { Field, ObjectType, ID } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { IFormField } from '../generated/contentfulTypes'

@ObjectType()
export class FormField {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  name?: string

  @Field()
  placeholder!: string

  @Field()
  type!:
    | 'input'
    | 'text'
    | 'dropdown'
    | 'radio'
    | 'acceptTerms'
    | 'email'
    | 'checkboxes'
    | 'file'
    | 'nationalId (kennitala)'
    | 'information'
    | 'numeric'
    | 'date'

  @Field()
  required!: boolean

  @Field(() => [String])
  options!: Array<string>

  @Field(() => graphqlTypeJson, { nullable: true })
  emailConfig?: Record<string, string>

  @Field(() => String, { nullable: true })
  informationText?: string
}

export const mapFormField = ({ sys, fields }: IFormField): FormField => ({
  id: sys.id,
  title: fields.title ?? '',
  name: fields.name ?? '',
  placeholder: fields.placeholder ?? '',
  type: fields.type ?? 'input',
  required: fields.required ?? false,
  options: fields.options ?? [],
  emailConfig: fields.emailConfig ?? {},
  informationText: fields.informationText ?? '',
})
