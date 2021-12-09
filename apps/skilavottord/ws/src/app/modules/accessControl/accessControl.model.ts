import { Field, ObjectType, ID } from '@nestjs/graphql'
import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Role } from '../auth'

@ObjectType('AccessControl')
@Table({ tableName: 'access_control', timestamps: false })
export class AccessControlModel extends Model<AccessControlModel> {
  // @Field()
  @Field((_) => ID)
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    field: 'national_id',
  })
  nationalId!: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string

  @Field(() => Role)
  @Column({
    type: DataType.STRING,
  })
  role!: Role

  // TODO: get from samgongustofa
  @Field()
  @Column({
    type: DataType.STRING,
    field: 'partner_id',
  })
  partnerId!: string
}
