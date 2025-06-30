import {
  Column,
  DataType,
  Model,
  Table,
  CreatedAt,
  UpdatedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { MeActorProfileDto } from '../dto/actor-profile.dto'
import { Emails } from './emails.model'
import { DataStatus } from '../../user-profile/types/dataStatusTypes'

@Table({
  tableName: 'actor_profile',
  timestamps: true,
  indexes: [
    {
      fields: ['to_national_id'],
    },
  ],
})
export class ActorProfile extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'actor_profile_to_from_unique',
      msg: 'combined unique constraint failed',
    },
  })
  @ApiProperty()
  toNationalId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: {
      name: 'actor_profile_to_from_unique',
      msg: 'combined unique constraint failed',
    },
  })
  @ApiProperty()
  fromNationalId!: string

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
    allowNull: true,
  })
  @ApiProperty()
  emailNotifications!: boolean

  @CreatedAt
  @ApiProperty()
  created!: Date

  @UpdatedAt
  @ApiProperty()
  modified!: Date

  @ForeignKey(() => Emails)
  @Column({
    type: DataType.UUID,
    allowNull: true,
    defaultValue: null,
  })
  @ApiProperty()
  emailsId?: string | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  nextNudge?: Date | null

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiProperty()
  lastNudge?: Date | null

  @BelongsTo(() => Emails, {
    foreignKey: 'emailsId',
    targetKey: 'id',
    as: 'emails',
  })
  emails?: Emails

  toDto(): MeActorProfileDto {
    return {
      fromNationalId: this.fromNationalId,
      emailNotifications: this.emailNotifications,
      emailsId: this.emailsId || null,
      email: this.emails?.email || null,
      emailVerified: this.emails?.emailStatus === DataStatus.VERIFIED,
    }
  }
}
