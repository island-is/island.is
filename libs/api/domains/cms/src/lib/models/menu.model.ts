import { Field, ObjectType } from '@nestjs/graphql'
import { Link } from './link.model'

@ObjectType()
export class Menu {
  @Field()
  title: string

  @Field(() => [Link])
  links: Link[]
}
