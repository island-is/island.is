import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

import { normalizeAndFormatNationalId } from '@island.is/judicial-system/formatters'
import { RequestSharedWhen } from '@island.is/judicial-system/types'

import { Case } from './case.model'

@Table({
  tableName: 'victim',
  timestamps: true,
})
export class Victim extends Model {
  static getVictimWithLawyer(lawyerNationalId: string, victims?: Victim[]) {
    // NOTE: victims per case can have the same lawyer but we intentionally return the first victim
    return victims?.find(
      (victim) =>
        victim.lawyerNationalId &&
        normalizeAndFormatNationalId(lawyerNationalId).includes(
          victim.lawyerNationalId,
        ) &&
        victim.lawyerAccessToRequest !== RequestSharedWhen.OBLIGATED,
    )
  }

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty({ type: String })
  id!: string

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: Date

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: Date

  @ForeignKey(() => Case)
  @Column({ type: DataType.UUID, allowNull: false })
  @ApiProperty({ type: String })
  caseId!: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  name?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  hasNationalId?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  nationalId?: string

  @Column({ type: DataType.BOOLEAN, allowNull: true })
  @ApiPropertyOptional({ type: Boolean })
  hasLawyer?: boolean

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  lawyerNationalId?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  lawyerName?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  lawyerEmail?: string

  @Column({ type: DataType.STRING, allowNull: true })
  @ApiPropertyOptional({ type: String })
  lawyerPhoneNumber?: string

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(RequestSharedWhen),
  })
  @ApiPropertyOptional({ enum: RequestSharedWhen })
  lawyerAccessToRequest?: string
}
