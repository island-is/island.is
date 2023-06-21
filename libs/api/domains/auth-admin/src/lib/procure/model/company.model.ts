import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType('AuthAdminProcureCompany')
export class ProcureCompany {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string
}
