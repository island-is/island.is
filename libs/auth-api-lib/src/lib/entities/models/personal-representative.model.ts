import {
  Column,
  CreatedAt,
  UpdatedAt,
  DataType,
  Model,
  Table,
  PrimaryKey,
  HasMany,
} from 'sequelize-typescript'
import { ApiProperty } from '@nestjs/swagger'
import { PersonalRepresentativeRight } from './personal-representative-right.model'
import { PersonalRepresentativeDTO } from '../dto/personal-representative.dto'

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

  toDTO(): PersonalRepresentativeDTO {
    return {
      id: this.id,
      nationalIdPersonalRepresentative: this.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: this.nationalIdRepresentedPerson,
      validTo: this.validTo,
      rightCodes: this.rights?.map((r) => r.rightTypeCode),
    }
  }

  fromDTO(id: string, dto: PersonalRepresentativeDTO): PersonalRepresentative {
    this.id = id
    this.nationalIdPersonalRepresentative = dto.nationalIdPersonalRepresentative
    this.nationalIdRepresentedPerson = dto.nationalIdRepresentedPerson
    this.validTo = dto.validTo
    return this
  }
}
