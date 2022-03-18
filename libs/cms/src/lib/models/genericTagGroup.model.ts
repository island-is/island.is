import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IGenericTagGroup } from '../generated/contentfulTypes'

@ObjectType()
export class GenericTagGroup {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  slug!: string
}

export const mapGenericTagGroup = ({
  sys,
  fields,
}: IGenericTagGroup): GenericTagGroup => ({
  id: sys.id,
  title: fields.title ?? '',
  slug: fields.slug ?? '',
})
