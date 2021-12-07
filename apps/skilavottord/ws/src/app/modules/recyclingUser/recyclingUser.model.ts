import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'
import { Role } from '../auth/auth.types'

@ObjectType()
@Table({ tableName: 'recycling_user' })
export class RecyclingUserModel extends Model<RecyclingUserModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    field: 'national_id',
  })
  nationalId: string

  @Field()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string

  @Field()
  @Column({
    type: DataType.STRING,
  })
  role: Role

  @Field()
  @Column({
    type: DataType.STRING,
  })
  partnerid: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
  })
  active: boolean

  @Field()
  @CreatedAt
  @Column({
    field: 'created_at',
  })
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column({
    field: 'updated_at',
  })
  updatedAt: Date
}
