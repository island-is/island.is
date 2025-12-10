import { Field, ID, ObjectType } from '@nestjs/graphql'
import { Link } from './link.model'
import { Entity } from './person.model'
import { Label } from './label.model'

@ObjectType('WorkMachine')
export class WorkMachine {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  type?: string

  @Field({ nullable: true })
  model?: string

  @Field({ nullable: true })
  category?: string

  @Field({ nullable: true })
  subCategory?: string

  @Field({ nullable: true })
  status?: string

  @Field({ nullable: true, description: 'ISO8601' })
  dateLastInspection?: string

  @Field({ nullable: true })
  registrationNumber?: string

  @Field({ nullable: true, description: 'ISO8601' })
  registrationDate?: string

  @Field({
    nullable: true,
    description:
      'Only populated when retrieved specifically by id, not as a collection',
  })
  productionNumber?: string

  @Field({
    nullable: true,
    description:
      'Only populated when retrieved specifically by id, not as a collection',
  })
  productionCountry?: string

  @Field({
    nullable: true,
    description:
      'Only populated when retrieved specifically by id, not as a collection',
  })
  productionYear?: string

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

  @Field({ nullable: true })
  paymentRequiredForOwnerChange?: boolean

  @Field(() => [Link], {
    nullable: true,
    description:
      'Only populated when retrieved specifically by id, not as a collection',
  })
  links?: Array<Link>

  @Field(() => [Label], {
    nullable: true,
    description:
      'Only populated when retrieved specifically by id, not as a collection',
  })
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
}
