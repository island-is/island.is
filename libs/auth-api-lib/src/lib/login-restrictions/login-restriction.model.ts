import { ApiProperty } from '@nestjs/swagger'
import { IsDate, IsString } from 'class-validator'
import {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize'
import {
  Column,
  CreatedAt,
  DataType,
  Model,
  Table,
  UpdatedAt,
  PrimaryKey,
  Unique,
} from 'sequelize-typescript'
import { LoginRestrictionDto } from './dto/login-restriction.dto'

@Table({
  tableName: 'login_restriction',
})
export class LoginRestriction extends Model<
  InferAttributes<LoginRestriction>,
  InferCreationAttributes<LoginRestriction>
> {
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  @IsString()
  nationalId!: string

  @Unique
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  @ApiProperty()
  @IsString()
  phoneNumber!: string

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  @ApiProperty()
  @IsDate()
  until!: Date

  // Internal only, not exposed in API
  @CreatedAt
  readonly created!: CreationOptional<Date>

  // Internal only, not exposed in API
  @UpdatedAt
  readonly modified?: CreationOptional<Date>

  toDto(): LoginRestrictionDto {
    return {
      nationalId: this.nationalId,
      phoneNumber: this.phoneNumber,
      until: this.until,
    }
  }
}
