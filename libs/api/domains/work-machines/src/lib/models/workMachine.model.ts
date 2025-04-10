import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Link } from './link.model'
import { Entity } from './person.model'
import { Label } from './label.model'
import { Type } from './type.model'

@ObjectType('WorkMachineV2')
export class WorkMachine {
  @Field(() => ID)
  id!: string

  @Field(() => Type, { nullable: true })
  typeBreakdown?: Type

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  subCategory?: string

  @Field({ nullable: true, description: 'ISO8601' })
  dateLastInspection?: string

  @Field({ nullable: true })
  registrationNumber?: string

  @Field({ nullable: true, description: 'ISO8601' })
  registrationDate?: string

  @Field({ nullable: true })
  productionNumber?: string

  @Field({ nullable: true })
  productionCountry?: string

  @Field(() => Int, { nullable: true })
  productionYear?: number

  @Field({ nullable: true })
  licensePlateNumber?: string

  @Field(() => Entity, {
    nullable: true,
  })
  owner?: Entity

  @Field(() => Entity, {
    nullable: true,
  })
  supervisor?: Entity

  @Field({ nullable: true })
  importer?: string

  @Field({ nullable: true })
  insurer?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>

  /** DEPRECATION LINE */

  @Field({ nullable: true, deprecationReason: 'Use owner property' })
  ownerName?: string

  @Field({ nullable: true, deprecationReason: 'Use owner property' })
  ownerNumber?: string

  @Field({ nullable: true, deprecationReason: 'Use owner property' })
  ownerNationalId?: string

  @Field({ nullable: true, deprecationReason: 'Use owner property' })
  ownerAddress?: string

  @Field({ nullable: true, deprecationReason: 'Use owner property' })
  ownerPostcode?: string

  @Field({ nullable: true, deprecationReason: 'Use supervisor property' })
  supervisorName?: string

  @Field({ nullable: true, deprecationReason: 'Use supervisor property' })
  supervisorNationalId?: string

  @Field({ nullable: true, deprecationReason: 'Use supervisor property' })
  supervisorAddress?: string

  @Field({ nullable: true, deprecationReason: 'Use supervisor property' })
  supervisorPostcode?: string

  @Field({ nullable: true, deprecationReason: 'Use typeBreakdown' })
  type?: string
}
