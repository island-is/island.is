import { Column, DataType, Model, Table } from 'sequelize-typescript'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
@Table({ tableName: 'gdpr' })
export class Gdpr extends Model<Gdpr> {
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
}
