import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IFormField } from '../generated/contentfulTypes'

@ObjectType()
export class FormField {
  @Field(() => ID)
  id!: string

  @Field()
  type!: string

  @Field()
  label!: string

  @Field({ nullable: true })
  placeholder?: string

  @Field(() => [String])
  options?: Array<string>
}

export const mapFormField = ({ fields, sys }: IFormField): FormField => ({
  id: sys.id,
  type: fields.type ?? '',
  label: fields.label ?? '',
  placeholder: fields.label ?? '',
  options: fields.options ?? [],
})
