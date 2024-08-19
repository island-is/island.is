import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('HealthDirectorateVaccinationsAge')
export class VaccinationsAge {
  @Field(() => Number, { nullable: true })
  years?: number

  @Field(() => Number, { nullable: true })
  months?: number
}

@ObjectType('HealthDirectorateVaccinationsDetail')
export class VaccinationsDetail {
  @Field(() => Number)
  id!: number

  @Field({ nullable: true })
  nationalId?: string

  @Field({ nullable: true })
  code?: string

  @Field(() => Date, { nullable: true })
  vaccinationDate?: Date

  @Field(() => VaccinationsAge, { nullable: true })
  vaccinationsAge?: VaccinationsAge

  @Field(() => Object, { nullable: true })
  generalComment?: object

  @Field(() => Boolean, { nullable: true })
  rejected?: boolean
}

@ObjectType('HealthDirectorateVaccinations')
export class Vaccinations {
  @Field()
  diseaseId!: string

  @Field({ nullable: true })
  diseaseName?: string

  @Field({ nullable: true })
  diseaseDescription?: string

  @Field()
  vaccinationStatus!:
    | 'valid'
    | 'expired'
    | 'complete'
    | 'incomplete'
    | 'undocumented'
    | 'unvaccinated'
    | 'rejected'
    | 'undetermined'

  @Field({ nullable: true })
  vaccinationsStatusName?: string

  @Field(() => Date, { nullable: true })
  lastVaccinationDate?: Date

  @Field(() => [VaccinationsDetail], { nullable: true })
  vaccinations?: VaccinationsDetail[]

  @Field(() => [String], { nullable: true })
  comments?: string[]
}
