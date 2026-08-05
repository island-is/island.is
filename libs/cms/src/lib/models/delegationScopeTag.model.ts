import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IDelegationScopeTag } from '../generated/contentfulTypes'

@ObjectType()
export class DelegationScopeTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  description?: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  showAsCard?: boolean
}

export const mapDelegationScopeTag = ({
  fields,
  sys,
}: IDelegationScopeTag): DelegationScopeTag => ({
  id: sys.id,
  title: fields.title ?? '',
  description: fields.description ?? '',
  slug: fields.slug ?? '',
  showAsCard: fields.showAsCard ?? false,
})
