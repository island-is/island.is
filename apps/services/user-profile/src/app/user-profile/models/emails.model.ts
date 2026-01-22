import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { UserProfile } from './userProfile.model'
import { DataStatus } from '../types/dataStatusTypes'
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import { ActorProfile } from './actor-profile.model'

@Table({
  tableName: 'emails',
  timestamps: true,
  indexes: [
    {
      fields: ['national_id'],
    },
  ],
})
export class Emails extends Model<
  InferAttributes<Emails>,
  InferCreationAttributes<Emails>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.ENUM(...Object.values(DataStatus)),
    defaultValue: 'NOT_DEFINED',
    allowNull: false,
  })
  @ApiProperty()
  emailStatus!: DataStatus

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  })
  @ApiProperty()
  primary!: boolean

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  @ApiProperty()
  email?: string | null

  @CreatedAt
  @ApiProperty()
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty()
  modified?: Date

  @ForeignKey(() => UserProfile)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalId!: string

  @BelongsTo(() => UserProfile, {
    foreignKey: 'nationalId', // 👈 field in Emails
    targetKey: 'nationalId', // 👈 field in UserProfile
    as: 'userProfile',
  })
  userProfile?: UserProfile

  @HasMany(() => ActorProfile, {
    foreignKey: 'emailsId',
    sourceKey: 'id',
  })
  actorProfiles?: ActorProfile[]
}
