import { ApiProperty } from '@nestjs/swagger'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript'

@Table({
  tableName: 'party_letter_registry',
  indexes: [
    {
      fields: ['owner'],
    },
  ],
})
export class PartyLetterRegistry extends Model {
  @ApiProperty()
  @Column({
    type: DataType.CHAR(2),
    primaryKey: true,
    get() {
      // this adds a space cause of char 2 we remove added spaces here
      const value: string = ((this as unknown) as Model).getDataValue(
        'partyLetter' as any,
      )
      return value.trim()
    },
    set(value: string) {
      // we want to ensure all inserted letters are uppercase
      ;((this as unknown) as Model).setDataValue(
        'partyLetter' as any,
        value.toUpperCase(),
      )
    },
  })
  partyLetter!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  partyName!: string

  @ApiProperty()
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string

  @ApiProperty()
  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  managers!: string[]

  @ApiProperty()
  @CreatedAt
  readonly created!: Date

  @ApiProperty()
  @UpdatedAt
  readonly modified!: Date
}
