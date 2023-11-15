import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Owner } from './owner.model'
import { Area } from './area.model'


@ObjectType()
export class SignatureList {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string

  @Field(() => Area)
  area!: Area

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date

  @Field(()=> Owner)
  owner!: Owner

  @Field(()=> [Owner], {nullable: true})
  collectors?: Owner[]

  @Field(() => Boolean, {nullable: true})
  active?: boolean

  @Field({nullable: true})
  collectionId?: string

  @Field({nullable: true})
  link?: string
}
