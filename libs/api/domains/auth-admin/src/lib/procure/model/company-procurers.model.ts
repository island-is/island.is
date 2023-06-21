import { Field, ObjectType } from '@nestjs/graphql'

import { Procure } from './procure.model'

@ObjectType('AuthAdminCompanyProcurers')
export class CompanyProcurers {
  @Field(() => String)
  name!: string

  @Field(() => String)
  nationalId!: string

  @Field(() => [Procure], { nullable: false })
  procurers?: Procure[]
}
