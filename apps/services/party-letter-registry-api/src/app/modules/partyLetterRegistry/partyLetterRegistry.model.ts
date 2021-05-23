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
export class PartyLetterRegistry extends Model<PartyLetterRegistry> {
  @Column({
    type: DataType.CHAR(2),
    primaryKey: true,
    get() {
      // this adds a space cause of char 2 we remove added spaces here
      const value: string = ((this as unknown) as Model<PartyLetterRegistry>).getDataValue(
        'partyLetter' as any,
      )
      return value.trim()
    },
  })
  partyLetter!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  partyName!: string

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  owner!: string

  @Column({
    type: DataType.ARRAY(DataType.STRING),
    allowNull: false,
  })
  managers!: string[]

  @CreatedAt
  readonly created!: Date

  @UpdatedAt
  readonly modified!: Date
}
