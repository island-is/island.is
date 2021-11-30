import {
  Column,
  CreatedAt,
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
  tableName: 'personal_representative_right_type',
})
export class PersonalRepresentative extends Model<PersonalRepresentative> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    primaryKey: true,
    allowNull: false,
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

  @HasMany(() => PersonalRepresentativeRight)
  @ApiProperty()
  rights!: PersonalRepresentativeRight[]  

  toDTO(): PersonalRepresentativeDTO {
    return {
      id: this.id,
      nationalIdPersonalRepresentative: this.nationalIdPersonalRepresentative,
      nationalIdRepresentedPerson: this.nationalIdRepresentedPerson,
      validTo: this.validTo,
      rightCodes: this.rights.map((r) =>  r.rightTypeCode)
    }
  }
}
