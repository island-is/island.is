import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Image } from '../image.model'

@ObjectType()
export class IconBullet {
  constructor(initializer: IconBullet) {
    Object.assign(this, initializer)
  }

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  body: string

  @Field(() => Image)
  icon: Image

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  linkText?: string
}
