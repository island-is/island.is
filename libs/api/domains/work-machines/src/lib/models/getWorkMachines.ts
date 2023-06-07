import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { WorkMachinesAction } from '../api-domains-work-machines.types'

registerEnumType(WorkMachinesAction, { name: 'WorkMachinesAction' })

@ObjectType('WorkMachinesEntity')
export class WorkMachineEntity {
  @Field(() => [WorkMachine], { nullable: true })
  value?: Array<WorkMachine> | null

  @Field(() => [Link], { nullable: true })
  links?: Array<Link> | null

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label> | null
}

@ObjectType('WorkMachinesWorkMachine')
export class WorkMachine {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  type?: string | null

  @Field(() => String, { nullable: true })
  status?: string | null

  @Field(() => String, { nullable: true })
  category?: string | null

  @Field(() => String, { nullable: true })
  subCategory?: string | null

  @Field(() => String, { nullable: true })
  dateLastInspection?: string | null

  @Field(() => String, { nullable: true })
  registrationNumber?: string | null

  @Field(() => String, { nullable: true })
  registrationDate?: string | null

  @Field(() => String, { nullable: true })
  productionNumber?: string | null

  @Field(() => String, { nullable: true })
  productionCountry?: string | null

  @Field(() => Number, { nullable: true })
  productionYear?: number | null

  @Field(() => String, { nullable: true })
  licensePlateNumber?: string | null

  @Field(() => String, { nullable: true })
  ownerName?: string | null

  @Field(() => String, { nullable: true })
  ownerNumber?: string | null

  @Field(() => String, { nullable: true })
  ownerNationalId?: string | null

  @Field(() => String, { nullable: true })
  ownerAddress?: string | null

  @Field(() => String, { nullable: true })
  ownerPostcode?: string | null

  @Field(() => String, { nullable: true })
  supervisorName?: string | null

  @Field(() => String, { nullable: true })
  supervisorNationalId?: string | null

  @Field(() => String, { nullable: true })
  supervisorAddress?: string | null

  @Field(() => String, { nullable: true })
  supervisorPostcode?: string | null

  @Field(() => String, { nullable: true })
  importer?: string | null

  @Field(() => String, { nullable: true })
  insurer?: string | null

  @Field(() => [Link], { nullable: true })
  links?: Array<Link> | null

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label> | null
}

@ObjectType('WorkMachinesLink')
export class Link {
  @Field(() => String, { nullable: true })
  href?: string | null

  @Field(() => WorkMachinesAction, { nullable: true })
  rel?: WorkMachinesAction | null

  @Field(() => String, { nullable: true })
  method?: string | null

  @Field(() => String, { nullable: true })
  displayTitle?: string | null
}

@ObjectType('WorkMachinesLabel')
export class Label {
  @Field(() => String, { nullable: true })
  columnName?: string | null

  @Field(() => String, { nullable: true })
  displayTitle?: string | null

  @Field(() => String, { nullable: true })
  tooltip?: string | null
}
