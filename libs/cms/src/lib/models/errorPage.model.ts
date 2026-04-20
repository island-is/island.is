import { Field, ID, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { IErrorPage } from '../generated/contentfulTypes'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class ErrorPage {
  @Field(() => ID)
  id!: string

  @Field()
  errorCode!: string

  @Field()
  title?: string

  @CacheField(() => [SliceUnion], { nullable: true })
  description?: Array<typeof SliceUnion>
}
export const mapErrorPage = ({ sys, fields }: IErrorPage): ErrorPage => ({
  id: sys.id,
  errorCode: fields.errorCode,
  title: fields.title ?? '',
  description: fields.description
    ? mapDocument(fields.description, sys.id + ':description')
    : [],
})
