import { Application } from '@island.is/api/domains/application'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class MyPagesApplication extends Application {
  @Field(() => String, { nullable: true })
  formSystemFormSlug?: string

  @Field(() => String, { nullable: true })
  formSystemOrgSlug?: string

  @Field(() => String, { nullable: true })
  formSystemOrgContentfulId?: string

  @Field(() => String, { nullable: true })
  path?: string

  @Field(() => String, { nullable: true })
  localhostPath?: string

  @Field(() => String, { nullable: true })
  slug?: string
}
