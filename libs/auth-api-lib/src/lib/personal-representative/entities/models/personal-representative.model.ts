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
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeType } from './personal-representative-type.model'
import { PersonalRepresentativeRight } from './personal-representative-right.model'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'
import { PersonalRepresentativeRightType } from './personal-representative-right-type.model'

@Table({
  tableName: 'personal_representative',
})
export class PersonalRepresentative extends Model<PersonalRepresentative> {
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
  personalRepresentativeTypeCode?: string

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
  @ApiProperty()
  validTo?: Date

  @CreatedAt
  @ApiProperty()
  readonly created!: Date

  @UpdatedAt
  @ApiProperty()
  readonly modified?: Date

  @ApiProperty({ type: () => [PersonalRepresentativeRight], required: false })
  @HasMany(() => PersonalRepresentativeRight)
  @ApiProperty()
  rights!: PersonalRepresentativeRight[]

  @ApiProperty({ type: () => PersonalRepresentativeType, required: false })
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
    }
  }

  fromDTO(id: string, dto: PersonalRepresentativeDTO): PersonalRepresentative {
    this.id = id
    this.contractId = dto.contractId
    this.externalUserId = dto.externalUserId
    this.personalRepresentativeTypeCode = dto.personalRepresentativeTypeCode
    this.nationalIdPersonalRepresentative = dto.nationalIdPersonalRepresentative
    this.nationalIdRepresentedPerson = dto.nationalIdRepresentedPerson
    this.validTo = dto.validTo
    return this
  }
}
