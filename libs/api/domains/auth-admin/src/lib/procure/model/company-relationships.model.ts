import { Field, ObjectType } from '@nestjs/graphql'

import { Procure } from './procure.model'

@ObjectType('AuthAdminProcureCompanyRelationships')
export class CompanyRelationships {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => [Procure], { nullable: false })
  procurers?: Procure[]
}
