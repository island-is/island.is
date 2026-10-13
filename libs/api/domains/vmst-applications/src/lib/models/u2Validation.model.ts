import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('VmstApplicationsU2ValidationResponse')
export class VmstApplicationsU2ValidationResponse {
  @Field(() => Boolean)
  isValid!: boolean

  @Field(() => String, { nullable: true })
  reason?: string | null

  @Field(() => String, { nullable: true })
  reasonEN?: string | null
}
