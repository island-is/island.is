import { DiseaseVaccinationDtoVaccinationStatusEnum } from '@island.is/clients/health-directorate'
import {
  Field,
  GraphQLISODateTime,
  Int,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql'
import { VaccinationStatusEnum } from './enums'

registerEnumType(DiseaseVaccinationDtoVaccinationStatusEnum, {
  name: 'HealthDirectorateVaccinationsStatus',
})

@ObjectType('HealthDirectorateVaccinationsAge')
export class Age {
  @Field(() => Int, { nullable: true })
  years?: number

  @Field(() => Int, { nullable: true })
  months?: number
}

@ObjectType('HealthDirectorateVaccinationsInfo')
export class Info {
  @Field(() => Int)
  id!: number

  @Field({ nullable: true })
  name?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  date?: Date | null

  @Field(() => Age, { nullable: true })
  age?: Age

  @Field({ nullable: true })
  url?: string

  @Field({ nullable: true })
  comment?: string

  @Field(() => Boolean, { nullable: true })
  rejected?: boolean

  @Field({ nullable: true })
  location?: string
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

  @Field(() => VaccinationStatusEnum, { nullable: true })
  status?: VaccinationStatusEnum

  @Field({ nullable: true })
  statusName?: string

  @Field({ nullable: true })
  statusColor?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastVaccinationDate?: Date | null

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
