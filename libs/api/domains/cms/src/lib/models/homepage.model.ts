import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IHomepage } from '../generated/contentfulTypes'
import { Featured, mapFeatured } from './featured.model'

@ObjectType()
export class Homepage {
  @Field(() => ID)
  id: string

  @Field(() => [Featured])
  featuredThings: Featured[]
}

export const mapHomepage = ({ sys, fields }: IHomepage): Homepage => ({
  id: sys.id,
  featuredThings: (fields.featured ?? []).map(mapFeatured),
})
