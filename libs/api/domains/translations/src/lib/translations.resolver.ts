import { Args, Query, Resolver } from '@nestjs/graphql'
import { TranslationsService, TranslationsDict } from './translations.service'
import { GetTranslationsInput } from './dto/getTranslationsInput'
import graphqlTypeJson from 'graphql-type-json'

@Resolver()
export class TranslationsResolver {
  constructor(private translationsService: TranslationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  getTranslations(
    @Args('input') input: GetTranslationsInput,
  ): Promise<TranslationsDict | null> {
    console.log('getTranslations', input)
    return this.translationsService.getTranslations(
      input?.namespaces,
      input?.lang,
    )
  }
}
