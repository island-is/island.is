import { Field, ObjectType } from '@nestjs/graphql'

import { IUiConfiguration } from '../generated/contentfulTypes'

@ObjectType()
export class UiConfiguration {
  @Field()
  namespace: string

  @Field({ nullable: true })
  fields?: Record<string, any>
}

export const mapUiConfiguration = ({
  fields,
}: IUiConfiguration): UiConfiguration => ({
  namespace: fields.namespace,
  fields: fields.fields ?? '',
})
