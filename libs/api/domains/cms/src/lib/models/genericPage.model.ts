import { Field, ObjectType } from '@nestjs/graphql'
import { IGenericPage } from '../generated/contentfulTypes'

@ObjectType()
export class GenericPage {
  @Field()
  title!: string

  @Field()
  slug!: string

  @Field({ nullable: true })
  intro?: string

  @Field({ nullable: true })
  mainContent?: string

  @Field({ nullable: true })
  sidebar?: string

  @Field({ nullable: true })
  misc?: string
}

export const mapGenericPage = ({ fields }: IGenericPage): GenericPage => ({
  title: fields.title ?? '',
  slug: fields.slug ?? '',
  intro: fields.intro ? JSON.stringify(fields.intro) : '',
  mainContent: fields.mainContent ? JSON.stringify(fields.mainContent) : '',
  sidebar: fields.sidebar ? JSON.stringify(fields.sidebar) : '',
  misc: fields.misc ? JSON.stringify(fields.misc) : '',
})
