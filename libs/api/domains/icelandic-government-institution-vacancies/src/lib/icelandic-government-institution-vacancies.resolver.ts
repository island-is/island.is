import {
  DefaultApi,
  VacanciesGetAcceptEnum,
  VacanciesVacancyIdGetAcceptEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies'
import { Args, Directive, Query, Resolver } from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacanciesInput } from './dto/icelandicGovernmentInstitutionVacancies.input'
import { IcelandicGovernmentInstitutionVacanciesResponse } from './dto/icelandicGovernmentInstitutionVacanciesResponse'
import { IcelandicGovernmentInstitutionVacancyByIdInput } from './dto/icelandicGovernmentInstitutionVacancyById.input'
import { IcelandicGovernmentInstitutionVacancyByIdResponse } from './dto/icelandicGovernmentInstitutionVacancyByIdResponse'
import {
  DefaultApiVacanciesListItem,
  DefaultApiVacancyDetails,
  mapIcelandicGovernmentInstitutionVacanciesResponse,
  mapIcelandicGovernmentInstitutionVacancyByIdResponse,
} from './utils'

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class IcelandicGovernmentInstitutionVacanciesResolver {
  constructor(private readonly api: DefaultApi) {}

  @Query(() => IcelandicGovernmentInstitutionVacanciesResponse)
  @Directive(cacheControlDirective())
  async icelandicGovernmentInstitutionVacancies(
    @Args('input') input: IcelandicGovernmentInstitutionVacanciesInput,
  ): Promise<IcelandicGovernmentInstitutionVacanciesResponse> {
    const data = (await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      language: input.language,
      stofnun: input.institution,
    })) as DefaultApiVacanciesListItem[]

    return {
      vacancies: mapIcelandicGovernmentInstitutionVacanciesResponse(data),
    }
  }

  @Query(() => IcelandicGovernmentInstitutionVacancyByIdResponse)
  @Directive(cacheControlDirective())
  async icelandicGovernmentInstitutionVacancyById(
    @Args('input') input: IcelandicGovernmentInstitutionVacancyByIdInput,
  ): Promise<IcelandicGovernmentInstitutionVacancyByIdResponse> {
    const item = (await this.api.vacanciesVacancyIdGet({
      vacancyId: input.id,
      accept: VacanciesVacancyIdGetAcceptEnum.Json,
      language: input.language,
    })) as DefaultApiVacancyDetails

    return {
      vacancy: await mapIcelandicGovernmentInstitutionVacancyByIdResponse(item),
    }
  }
}
