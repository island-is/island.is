import { Args, Query, Resolver } from '@nestjs/graphql'
import graphqlTypeJson from 'graphql-type-json'

import { Locale } from '@island.is/shared/types'

import {
  CmsTranslationsService,
  TranslationsDict,
} from './cms-translations.service'
import { GetTranslationsInput } from './dto/getTranslationsInput'

@Resolver()
export class CmsTranslationsResolver {
  constructor(private cmsTranslationsService: CmsTranslationsService) {}

  @Query(() => graphqlTypeJson, { nullable: true })
  async getTranslations(
    @Args('input') input: GetTranslationsInput,
  ): Promise<TranslationsDict | null> {
    return this.cmsTranslationsService.getTranslations(
      input.namespaces,
      input.lang as Locale,
    )
  }
}
