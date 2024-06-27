import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'
import { Section } from '../../sections/models/section.model'
import { CreationOptional } from 'sequelize'
import { Input } from '../../inputs/models/input.model'
import { LanguageType } from '../../../dataTypes/languageType.model'

@Table({ tableName: 'pages' })
export class Page extends Model<Page> {
  @Column({
    type: DataType.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  @ApiProperty()
  id!: string

  @Column({
    type: DataType.JSON,
    allowNull: false,
    defaultValue: () => new LanguageType(),
  })
  @ApiProperty()
  name!: LanguageType

  @CreatedAt
  @ApiProperty({ type: Date })
  created!: CreationOptional<Date>

  @UpdatedAt
  @ApiProperty({ type: Date })
  modified!: CreationOptional<Date>

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  displayOrder!: number

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  @ApiProperty()
  isHidden!: boolean

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  @ApiProperty()
  multiset!: number

  @HasMany(() => Input)
  @ApiProperty({ type: [Input] })
  inputs?: Input[]

  @ForeignKey(() => Section)
  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'section_id',
  })
  sectionId!: string
}
