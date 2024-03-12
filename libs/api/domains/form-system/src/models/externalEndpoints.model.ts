import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'

enum Type {
  submit = 'submit',
  validation = 'validation',
}

registerEnumType(Type, {
  name: 'FormSystemType',
})

enum Environment {
  production = 'production',
  development = 'development',
}

registerEnumType(Environment, {
  name: 'FormSystemEnvironment',
})

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
