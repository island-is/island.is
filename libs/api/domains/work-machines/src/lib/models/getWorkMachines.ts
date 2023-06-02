import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType('WorkMachinesEntity')
export class WorkMachineEntity {
  @Field(() => [WorkMachine], { nullable: true })
  value?: Array<WorkMachine>

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>
}

@ObjectType('WorkMachinesWorkMachine')
export class WorkMachine {
  @Field(() => ID, { nullable: true })
  id?: string

  @Field(() => String, { nullable: true })
  registrationNumber?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  ownerName?: string

  @Field(() => String, { nullable: true })
  ownerNumber?: string

  @Field(() => String, { nullable: true })
  productionNumber?: string

  @Field(() => String, { nullable: true })
  productionCountry?: string

  @Field(() => String, { nullable: true })
  productionYear?: string

  @Field(() => String, { nullable: true })
  licensePlateNumber?: string

  @Field(() => String, { nullable: true })
  supervisorName?: string

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>
}

@ObjectType('WorkMachinesLink')
export class Link {
  @Field(() => String, { nullable: true })
  href?: string

  @Field(() => String, { nullable: true })
  ref?: string

  @Field(() => String, { nullable: true })
  method?: string

  @Field(() => String, { nullable: true })
  displayTitle?: string
}

@ObjectType('WorkMachinesLabel')
export class Label {
  @Field(() => String, { nullable: true })
  columnName?: string

  @Field(() => String, { nullable: true })
  displayTitle?: string

  @Field(() => String, { nullable: true })
  tooltip?: string
}
