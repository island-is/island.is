import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsValidationUnemploymentApplication')
export class VmstApplicationsValidationUnemploymentApplication {
  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => String, { nullable: true })
  userMessageIS?: string | null

  @Field(() => String, { nullable: true })
  userMessageEN?: string | null
}
