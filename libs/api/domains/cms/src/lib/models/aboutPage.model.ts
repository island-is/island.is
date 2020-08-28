import { Field, ObjectType } from '@nestjs/graphql'
import { Slice } from './slices/slice.model'

@ObjectType()
export class AboutPage {
  @Field()
  title: string

  @Field()
  seoDescription: string

  @Field()
  theme: string

  @Field(() => [Slice])
  slices: Array<typeof Slice>
}
