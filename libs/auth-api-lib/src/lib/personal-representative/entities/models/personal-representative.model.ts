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
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { PersonalRepresentativeType } from './personal-representative-type.model'
import { PersonalRepresentativeRight } from './personal-representative-right.model'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'
import { PersonalRepresentativePublicDTO } from '../dto/personal-representative-public.dto'

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
  @ApiProperty()
  rights!: PersonalRepresentativeRight[]

  @ApiProperty({ type: () => PersonalRepresentativeType })
  @ApiProperty()
  type!: PersonalRepresentativeType

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
