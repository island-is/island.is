import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class ProcuraCompanies {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string
}

@ObjectType()
export class ProcuraCategoryInfo {
  @Field(() => String)
  type!: string

  @Field(() => String)
  system!: string

  @Field(() => String)
  key!: string

  @Field(() => String)
  value!: string
}

@ObjectType()
export class ProcuraCompaniesDetail {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => [ProcuraCategoryInfo], { nullable: true })
  categoryInfo?: ProcuraCategoryInfo[]
}

@ObjectType()
export class ProcuraSimple {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => [ProcuraCompanies], { nullable: true })
  companies?: ProcuraCompanies[]
}

@ObjectType()
export class ProcuraDetail {
  @Field(() => ID)
  nationalId!: string

  @Field(() => String)
  name!: string

  @Field(() => [ProcuraCategoryInfo], { nullable: true })
  categoryInfo?: ProcuraCategoryInfo[]

  @Field(() => [ProcuraCompanies], { nullable: true })
  companies?: ProcuraCompanies[]
}
