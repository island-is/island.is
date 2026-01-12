import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AppraisalUnit')
export class AppraisalUnit {
  @Field(() => Number, { nullable: true })
  readonly propertyCode?: number

  @Field(() => Number, { nullable: true })
  readonly propertyValue?: number

  @Field(() => Number, { nullable: true })
  readonly propertyLandValue?: number

  @Field(() => String, { nullable: true })
  readonly propertyUsageDescription?: string

  @Field(() => Number, { nullable: true })
  readonly addressCode?: number

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => String, { nullable: true })
  readonly unitCode?: string

  @Field(() => [Unit], { nullable: true })
  readonly units?: Unit[]
}

@ObjectType('Unit')
export class Unit {
  @Field(() => Number, { nullable: true })
  readonly appraisalUnitCode?: number

  @Field(() => Number, { nullable: true })
  readonly propertyValue?: number

  @Field(() => Number, { nullable: true })
  readonly propertyCode?: number

  @Field(() => String, { nullable: true })
  readonly propertyUsageDescription?: string

  @Field(() => String, { nullable: true })
  readonly unitCode?: string

  @Field(() => Number, { nullable: true })
  readonly addressCode?: number

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => Number, { nullable: true })
  readonly fireInsuranceValuation?: number

  @Field(() => Number, { nullable: true })
  readonly size?: number

  @Field(() => String, { nullable: true })
  readonly sizeUnit?: string
}

@ObjectType('HmsPropertyInfo')
export class PropertyInfo {
  @Field(() => Number, { nullable: true })
  readonly propertyCode?: number

  @Field(() => Number, { nullable: true })
  readonly landCode?: number

  @Field(() => Number, { nullable: true })
  readonly addressCode?: number

  @Field(() => String, { nullable: true })
  readonly address?: string

  @Field(() => Number, { nullable: true })
  readonly postalCode?: number

  @Field(() => String, { nullable: true })
  readonly municipalityName?: string

  @Field(() => Number, { nullable: true })
  readonly municipalityCode?: number

  @Field(() => String, { nullable: true })
  readonly unitCode?: string

  @Field(() => String, { nullable: true })
  readonly propertyUsageDescription?: string

  @Field(() => Number, { nullable: true })
  readonly size?: number

  @Field(() => String, { nullable: true })
  readonly sizeUnit?: string

  @Field(() => Number, { nullable: true })
  readonly propertyValue?: number

  @Field(() => Number, { nullable: true })
  readonly propertyLandValue?: number

  @Field(() => [AppraisalUnit], { nullable: true })
  readonly appraisalUnits?: AppraisalUnit[]
}

@ObjectType('HmsPropertyInfos')
export class PropertyInfos {
  @Field(() => [PropertyInfo])
  propertyInfos?: PropertyInfo[]
}
