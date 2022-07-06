import { Field, ObjectType } from '@nestjs/graphql'
import { PagingData } from './propertyOwners.model'

@ObjectType()
export class Appraisal {
  @Field({ nullable: true })
  activeAppraisal?: number

  @Field({ nullable: true })
  plannedAppraisal?: number

  @Field({ nullable: true })
  activeStructureAppraisal?: number

  @Field({ nullable: true })
  plannedStructureAppraisal?: number

  @Field({ nullable: true })
  activePlotAssessment?: number

  @Field({ nullable: true })
  plannedPlotAssessment?: number

  @Field({ nullable: true })
  activeYear?: number

  @Field({ nullable: true })
  plannedYear?: number
}

@ObjectType()
export class PropertyLocation {
  @Field({ nullable: true })
  locationNumber?: number

  @Field({ nullable: true })
  postNumber?: number

  @Field({ nullable: true })
  municipality?: string

  @Field({ nullable: true })
  propertyNumber?: number

  @Field({ nullable: true })
  display?: string

  @Field({ nullable: true })
  displayShort?: string
}

@ObjectType()
export class UnitOfUse {
  @Field({ nullable: true })
  propertyNumber?: string

  @Field({ nullable: true })
  unitOfUseNumber?: string

  @Field(() => PropertyLocation, { nullable: true })
  address?: PropertyLocation

  @Field({ nullable: true })
  marking?: string

  @Field({ nullable: true })
  usageDisplay?: string

  @Field({ nullable: true })
  displaySize?: number

  @Field({ nullable: true })
  buildYearDisplay?: string

  @Field({ nullable: true })
  fireAssessment?: number

  @Field({ nullable: true })
  explanation?: string

  @Field(() => Appraisal, { nullable: true })
  appraisal?: Appraisal
}

@ObjectType()
export class UnitsOfUseModel {
  @Field(() => PagingData, { nullable: true })
  paging?: PagingData

  @Field(() => [UnitOfUse], { nullable: true })
  unitsOfUse?: UnitOfUse[]
}
