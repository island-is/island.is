import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IFormField } from '../generated/contentfulTypes'

@ObjectType()
export class FormField {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  placeholder!: string

  @Field()
  type!: 'input' | 'text' | 'dropdown' | 'radio' | 'acceptTerms'

  @Field()
  required!: boolean

  @Field(() => [String])
  options!: Array<string>
}

export const mapFormField = ({ sys, fields }: IFormField): FormField => ({
  id: sys.id,
  title: fields.title ?? '',
  placeholder: fields.placeholder ?? '',
  type: fields.type ?? '',
  required: fields.required ?? false,
  options: fields.options ?? [],
})
