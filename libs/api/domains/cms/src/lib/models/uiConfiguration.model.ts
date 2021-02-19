import { Field, ObjectType, ID } from '@nestjs/graphql'

import { IUiConfiguration } from '../generated/contentfulTypes'

@ObjectType()
export class UiConfiguration {
  @Field()
  namespace: string
  @Field()
  fields: string
}
export const mapUiConfiguration = ({
  fields,
}: IUiConfiguration): UiConfiguration => ({
  namespace: fields.namespace,
  fields: fields.fields ? JSON.stringify(fields.fields) : '',
})
