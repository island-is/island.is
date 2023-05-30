import {
  DefaultApi,
  VacanciesGetAcceptEnum,
} from '@island.is/clients/icelandic-government-institution-vacancies'
import {
  Args,
  Directive,
  Field,
  ObjectType,
  Query,
  Resolver,
} from '@nestjs/graphql'
import { IcelandicGovernmentInstitutionVacanciesInput } from './dto/icelandicGovernmentInstitutionVacancies.input'

@ObjectType()
class Temp {
  @Field()
  test!: string
}

const cacheTime = process.env.CACHE_TIME || 300
const cacheControlDirective = (ms = cacheTime) => `@cacheControl(maxAge: ${ms})`

@Resolver()
export class IcelandicGovernmentInstitutionVacanciesResolver {
  constructor(private readonly api: DefaultApi) {}

  @Query(() => Temp)
  @Directive(cacheControlDirective())
  async icelandicGovernmentInstitutionVacancies(
    @Args('input') input: IcelandicGovernmentInstitutionVacanciesInput,
  ) {
    const data = await this.api.vacanciesGet({
      accept: VacanciesGetAcceptEnum.Json,
      language: input.language,
      stofnun: input.organization,
    })

    console.log(data)

    return {
      test: JSON.stringify(data),
    }
  }
}
