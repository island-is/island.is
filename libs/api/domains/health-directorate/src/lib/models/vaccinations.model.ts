import { DiseaseVaccinationDtoVaccinationStatusEnum } from '@island.is/clients/health-directorate'
import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

registerEnumType(DiseaseVaccinationDtoVaccinationStatusEnum, {
  name: 'HealthDirectorateVaccinationsStatus',
})

@ObjectType('HealthDirectorateVaccinationsAge')
export class Age {
  @Field(() => Number, { nullable: true })
  years?: number

  @Field(() => Number, { nullable: true })
  months?: number
}

@ObjectType('HealthDirectorateVaccinationsInfo')
export class Info {
  @Field(() => Number)
  id!: number

  @Field({ nullable: true })
  name?: string

  @Field(() => Date, { nullable: true })
  date?: Date

  @Field(() => Age, { nullable: true })
  age?: Age

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  comment?: string

  @Field(() => Boolean, { nullable: true })
  rejected?: boolean
}

@ObjectType('HealthDirectorateVaccination')
export class Vaccination {
  @Field()
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  description?: string

  @Field(() => Boolean, { nullable: true })
  isFeatured?: boolean

  @Field()
  status!: string

  @Field({ nullable: true })
  statusName?: string

  @Field(() => Date, { nullable: true })
  lastVaccinationDate?: Date

  @Field(() => [Info], { nullable: true })
  vaccinationsInfo?: Info[]

  @Field(() => [String], { nullable: true })
  comments?: string[]
}

@ObjectType('HealthDirectorateVaccinations')
export class Vaccinations {
  @Field(() => [Vaccination])
  vaccinations!: Vaccination[]
}
