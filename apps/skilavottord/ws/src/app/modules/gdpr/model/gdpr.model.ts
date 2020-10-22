import { Field, ObjectType } from '@nestjs/graphql'
import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript'

@ObjectType()
@Table({ tableName: 'gdpr' })
export class GdprModel extends Model<GdprModel> {
  @Field()
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  nationalId: string

  @Field()
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  gdprStatus: boolean

  @Field()
  @CreatedAt
  @Column
  createdAt: Date

  @Field()
  @UpdatedAt
  @Column
  updatedAt: Date
}
