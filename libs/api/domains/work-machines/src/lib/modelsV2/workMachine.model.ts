import { Field, ID, Int, ObjectType } from '@nestjs/graphql'
import { Label } from '../models/getWorkMachines'
import { Link } from './link.model'

@ObjectType('WorkMachine')
export class WorkMachine {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  type?: string

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
  ownerName?: string

  @Field({ nullable: true })
  ownerNumber?: string

  @Field({ nullable: true })
  ownerNationalId?: string

  @Field({ nullable: true })
  ownerAddress?: string

  @Field({ nullable: true })
  ownerPostcode?: string

  @Field({ nullable: true })
  supervisorName?: string

  @Field({ nullable: true })
  supervisorNationalId?: string

  @Field({ nullable: true })
  supervisorAddress?: string

  @Field({ nullable: true })
  supervisorPostcode?: string

  @Field({ nullable: true })
  importer?: string

  @Field({ nullable: true })
  insurer?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>
}
