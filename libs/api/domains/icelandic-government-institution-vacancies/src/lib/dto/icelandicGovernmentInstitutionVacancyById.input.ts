import { VacanciesVacancyIdGetLanguageEnum } from '@island.is/clients/icelandic-government-institution-vacancies'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

registerEnumType(VacanciesVacancyIdGetLanguageEnum, {
  name: 'VacanciesVacancyIdGetLanguageEnum',
})

@InputType()
export class IcelandicGovernmentInstitutionVacancyByIdInput {
  @Field()
  id!: number

  @Field(() => VacanciesVacancyIdGetLanguageEnum, { nullable: true })
  language?: VacanciesVacancyIdGetLanguageEnum
}
