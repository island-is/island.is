import { Field, ObjectType } from '@nestjs/graphql'
import { IFeatured } from '../generated/contentfulTypes'
import { PageUnion, mapPageUnion } from '../unions/page.union'

@ObjectType()
export class Featured {
  @Field()
  title: string

  @Field(() => Boolean)
  attention: boolean

  @Field(() => PageUnion)
  thing: typeof PageUnion
}

export const mapFeatured = ({ fields }: IFeatured): Featured => ({
  title: fields.title ?? '',
  attention: fields.attention ?? false,
  thing: fields.thing && mapPageUnion(fields.thing),
})
