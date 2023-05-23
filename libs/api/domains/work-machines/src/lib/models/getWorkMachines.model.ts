import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class WorkMachineEntity {
  @Field(() => [WorkMachine], { nullable: true })
  value?: Array<WorkMachine>

  @Field(() => [Link], { nullable: true })
  links?: Array<Link>

  @Field(() => [Label], { nullable: true })
  labels?: Array<Label>
}

@ObjectType()
export class WorkMachine {
  @Field(() => String, { nullable: true })
  registrationNumber?: string

  @Field(() => String, { nullable: true })
  type?: string

  @Field(() => String, { nullable: true })
  owner?: string

  @Field(() => String, { nullable: true })
  status?: string

  @Field(() => String, { nullable: true })
  dateLastInspection?: string
}

@ObjectType()
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

@ObjectType()
export class Label {
  @Field(() => String, { nullable: true })
  columnName?: string

  @Field(() => String, { nullable: true })
  displayTitle?: string

  @Field(() => String, { nullable: true })
  tooltip?: string
}
