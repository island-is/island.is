import { Field, ObjectType, ID } from '@nestjs/graphql'
import { RecyclingPartner } from '../../recyclingPartner'

@ObjectType()
export class Car {
  constructor(
    permno: string,
    type: string,
    color: string,
    newregdate: string,
    recyclable: boolean,
  ) {
    this.permno = permno
    this.type = type
    this.color = color
    this.newregdate = newregdate
    this.recyclable = recyclable
    this.isRecycled = false
  }

  @Field((_1) => ID)
  permno: string

  @Field()
  type: string

  @Field()
  color: string

  @Field()
  newregdate: string

  @Field()
  recyclable: boolean

  @Field({ nullable: true })
  recyclingPartner: RecyclingPartner
}
