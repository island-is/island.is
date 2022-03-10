import { Field, ID, ObjectType } from '@nestjs/graphql'
import { INumberBullet } from '../generated/contentfulTypes'

@ObjectType()
export class NumberBullet {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field()
  body!: string
}

export const mapNumberBullet = ({
  fields,
  sys,
}: INumberBullet): NumberBullet => ({
  id: sys.id,
  title: fields.title ?? '',
  body: fields.body ?? '',
})
