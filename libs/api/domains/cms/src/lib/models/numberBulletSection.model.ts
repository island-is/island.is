import { Field, ObjectType, Int } from '@nestjs/graphql'

import { INumberBulletSection } from '../generated/contentfulTypes'

import { NumberBullet, mapNumberBullet } from './numberBullet.model'

@ObjectType()
export class NumberBulletSection {
  @Field({ nullable: true })
  title?: string

  @Field(() => Int)
  defaultVisible: number

  @Field(() => [NumberBullet])
  bullets: Array<NumberBullet>
}

export const mapNumberBulletSection = ({
  fields,
}: INumberBulletSection): NumberBulletSection => ({
  title: fields.title ?? '',
  defaultVisible: fields.defaultVisible,
  bullets: fields.bullets.map(mapNumberBullet),
})
