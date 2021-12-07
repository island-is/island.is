import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Column } from 'sequelize-typescript'

import { Role } from '../auth'

@ObjectType('AccessControl')
export class AccessControlModel {
  @Field((_) => ID)
  @Column({
    field: 'national_id',
  })
  nationalId!: string

  @Field()
  name!: string

  @Field(() => Role)
  role!: Role

  // TODO: get from samgongustofa
  @Field()
  partnerId!: string
}
