import { Field, ID, ObjectType } from '@nestjs/graphql'
import { IServicePortalPage } from '../generated/contentfulTypes'
import { FaqList, mapFaqList } from './faqList.model'
import { CacheField } from '@island.is/nest/graphql'

@ObjectType()
export class ServicePortalPage {
  @Field(() => ID)
  id!: string

  @Field()
  slug!: string

  @CacheField(() => FaqList)
  faqList!: FaqList | null
}

export const mapServicePortalPage = (
  page: IServicePortalPage,
): ServicePortalPage => {
  return {
    id: page.sys.id,
    slug: page.fields.slug,
    faqList: page.fields.faqList ? mapFaqList(page.fields.faqList) : null,
  }
}
