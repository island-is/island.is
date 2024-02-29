import { Field, ID, ObjectType } from "@nestjs/graphql";

enum Type {
  SUBMIT = 'submit',
  VALIDATION = 'validation',
}

enum Environment {
  PRODUCTION = 'production',
  DEVELOPMENT = 'development',
}


@ObjectType('FormSystemExternalEndpoints')
export class ExternalEndpoints {
  @Field(() => ID, { nullable: true })
  id?: number

  @Field(() => String, { nullable: true })
  url?: string

  @Field(() => Type, { nullable: true })
  type?: Type

  @Field(() => Environment, { nullable: true })
  environment?: Environment
}
