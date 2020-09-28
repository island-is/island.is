import { Field, ObjectType, ID } from '@nestjs/graphql'
<<<<<<< HEAD
import { RecyclingPartner } from '../../recyclingPartner'
=======
>>>>>>> master

@ObjectType()
export class Car {
  constructor(
<<<<<<< HEAD
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
=======
    id: string,
    name: string,
    model: string,
    color: string,
    year: string,
    recyclable: boolean,
  ) {
    this.id = id
    this.name = name
    this.model = model
    this.color = color
    this.year = year
>>>>>>> master
    this.recyclable = recyclable
  }

  @Field((_1) => ID)
<<<<<<< HEAD
  permno: string

  @Field()
  type: string
=======
  id: string

  @Field()
  name: string

  @Field()
  model: string
>>>>>>> master

  @Field()
  color: string

  @Field()
<<<<<<< HEAD
  newregdate: string

  @Field()
  recyclable: boolean

  @Field({ nullable: true })
  recyclingPartner: RecyclingPartner
=======
  year: string

  @Field()
  recyclable: boolean
>>>>>>> master
}
