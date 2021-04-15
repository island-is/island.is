import { Args, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'
import { Locale } from '@island.is/shared/types'

import { TranslationsService, TranslationsDict } from './translations.service'
import { GetTranslationsInput } from './dto/getTranslationsInput'

@Resolver()
export class TranslationsResolver {
  constructor(private translationsService: TranslationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  async getTranslations(
    @Args('input') input: GetTranslationsInput,
  ): Promise<TranslationsDict | null> {
    return this.translationsService.getTranslations(
      input.namespaces,
      input.lang as Locale,
    )
  }
}
