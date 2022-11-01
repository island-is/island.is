import {
  Column,
  CreatedAt,
  UpdatedAt,
  DataType,
  Model,
  Table,
  PrimaryKey,
  ForeignKey,
  HasMany,
} from 'sequelize-typescript'
import { IsEnum, IsOptional } from 'class-validator'

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PersonalRepresentativeType } from './personal-representative-type.model'
import { PersonalRepresentativeRight } from './personal-representative-right.model'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'
import { PersonalRepresentativePublicDTO } from '../dto/personal-representative-public.dto'
import { IsBoolean } from 'class-validator'
import { InactiveReason } from './personal-representative.enum'

@Table({
  tableName: 'personal_representative',
  indexes: [
    {
      fields: ['national_id_personal_representative'],
    },
    {
      fields: ['national_id_represented_person'],
    },
  ],
})
export class PersonalRepresentative extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
    defaultValue: DataType.UUIDV4,
  })
  id!: string

  @ForeignKey(() => PersonalRepresentativeType)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  personalRepresentativeTypeCode!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  contractId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  externalUserId!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalIdPersonalRepresentative!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  nationalIdRepresentedPerson!: string

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  @ApiPropertyOptional()
  validTo?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiPropertyOptional()
  readonly modified?: Date

  @ApiProperty({ type: () => [PersonalRepresentativeRight] })
  @HasMany(() => PersonalRepresentativeRight)
  rights!: PersonalRepresentativeRight[]

  @ApiProperty({ type: () => PersonalRepresentativeType })
  type!: PersonalRepresentativeType

  @IsBoolean()
  @ApiProperty({ type: DataType.BOOLEAN, default: false })
  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  inactive!: boolean

  @IsOptional()
  @IsEnum(InactiveReason)
  @ApiProperty({ enum: InactiveReason, nullable: true })
  @Column({
    type: DataType.ENUM(...Object.values(InactiveReason)),
    defaultValue: null,
    allowNull: true,
    validate: {
      ddlConstraint(this: PersonalRepresentative) {
        if (this.inactive && !this.inactiveReason) {
          throw new Error('inactive is required')
        }
      },
    },
  })
  inactiveReason?: InactiveReason

  toDTO(): PersonalRepresentativeDTO {
    return {
      id: this.id,
      externalUserId: this.externalUserId,
      contractId: this.contractId,
      personalRepresentativeTypeCode: this.personalRepresentativeTypeCode,
      nationalIdPersonalRepresentative: this.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: this.nationalIdRepresentedPerson,
      validTo: this.validTo,
      rights: this.rights?.map((r) =>
        (r.rightType as PersonalRepresentativeRightType).toDTO(),
      ),
      inactive: this.inactive,
      inactiveReason: this.inactiveReason,
    } as PersonalRepresentativeDTO
  }

  toPublicDTO(): PersonalRepresentativePublicDTO {
    return {
      personalRepresentativeTypeCode: this.personalRepresentativeTypeCode,
      nationalIdPersonalRepresentative: this.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: this.nationalIdRepresentedPerson,
      rights: this.rights?.map(
        (r) => (r.rightType as PersonalRepresentativeRightType).code,
      ),
    }
  }
}
