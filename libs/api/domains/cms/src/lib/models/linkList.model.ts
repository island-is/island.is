import { Field, ObjectType } from '@nestjs/graphql'
import { Link } from './link.model'

@ObjectType()
export class LinkList {
  @Field({ nullable: true })
  title: string

  @Field(() => [Link])
  links: Array<Link>
}
