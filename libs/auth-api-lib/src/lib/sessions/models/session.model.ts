import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript'

import { SessionDto } from '../dto/session.dto'

@Table({
  tableName: 'session',
})
export class Session extends Model {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
  })
  key!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  scheme!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  subjectId!: string

  @Column({
    type: DataType.STRING,
  })
  sessionId?: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  created!: Date

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  renewed!: Date

  @Column({
    type: DataType.DATE,
  })
  expires?: Date

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  data!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  actorSubjectId!: string

  toDto(): SessionDto {
    return {
      key: this.key,
      scheme: this.scheme,
      subjectId: this.subjectId,
      sessionId: this.sessionId,
      created: this.created,
      renewed: this.renewed,
      expires: this.expires,
      ticket: this.data,
      actorSubjectId: this.actorSubjectId,
    }
  }
}
