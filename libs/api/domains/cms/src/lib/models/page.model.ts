import { Field, ObjectType } from '@nestjs/graphql'
import { Slice } from './slices/slice.model'

@ObjectType()
export class Page {
  @Field()
  title: string

  @Field()
  slug: string

  @Field()
  seoDescription: string

  @Field()
  theme: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}
