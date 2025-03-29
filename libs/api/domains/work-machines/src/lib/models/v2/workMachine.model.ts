import { ObjectType, Field, ID, Int } from '@nestjs/graphql'
import { Person } from './person.model'
import { Link } from './link.model'
import { Label } from './label.model'
import { Type } from './type.model'

@ObjectType('WorkMachine')
export class WorkMachine {
  @Field(() => ID)
  id!: string

  @Field(() => Type, { nullable: true })
  type?: Type

  @Field()
  registrationNumber!: string

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  subcategory?: string

  @Field({ nullable: true })
  dateLastInspection?: string

  @Field({ nullable: true })
  registrationDate?: string

  @Field({ nullable: true })
  productionNumber?: string

  @Field({ nullable: true })
  productionCountry?: string

  @Field(() => Int, { nullable: true })
  productionYear?: number

  @Field({ nullable: true })
  licensePlateNumber?: string

  @Field({ nullable: true })
  mayStreetRegister?: boolean

  @Field({ nullable: true })
  paymentRequiredForOwnerChange?: boolean

  @Field(() => Person, { nullable: true })
  owner?: Person

  @Field(() => Person, { nullable: true })
  supervisor?: Person

  @Field({ nullable: true })
  importer?: string

  @Field({ nullable: true })
  insurer?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>
}
