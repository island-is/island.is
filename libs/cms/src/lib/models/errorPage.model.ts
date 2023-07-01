import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IErrorPage } from '../generated/contentfulTypes'
import { Html, mapHtml } from './html.model'

@ObjectType()
export class ErrorPage {
  @Field(() => ID)
  id!: string

  @Field()
  errorCode!: string

  @Field()
  title?: string

  @CacheField(() => Html, { nullable: true })
  description?: Html | null
}
export const mapErrorPage = ({ sys, fields }: IErrorPage): ErrorPage => ({
  id: sys.id,
  errorCode: fields.errorCode,
  title: fields.title ?? '',
  description:
    (fields.description &&
      mapHtml(fields.description, sys.id + ':description')) ??
    null,
})
