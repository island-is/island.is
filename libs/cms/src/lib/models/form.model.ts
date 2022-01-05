import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IForm } from '../generated/contentfulTypes'
import { FormField, mapFormField } from './formField.model'

@ObjectType()
export class Form {
  @Field(() => ID)
  id!: string

  @Field(() => [FormField])
  fields!: Array<FormField>
}

export const mapForm = ({ fields, sys }: IForm): Form => ({
  id: sys.id,
  fields: (fields.fields ?? []).map(mapFormField),
})
