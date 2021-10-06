import { Field, ObjectType } from '@nestjs/graphql'
import { IUiConfiguration } from '../generated/contentfulTypes'

@ObjectType()
export class Namespace {
  @Field()
  namespace!: string

  @Field()
  fields?: string
}

export const mapNamespace = ({ fields }: IUiConfiguration): Namespace => ({
  namespace: fields.namespace,
  fields: fields.fields ? JSON.stringify(fields.fields) : '',
})
