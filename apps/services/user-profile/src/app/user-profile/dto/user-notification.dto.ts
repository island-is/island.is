import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsDate, IsString } from 'class-validator'
import { IsNationalId } from '@island.is/nest/validators'
import { Type } from 'class-transformer'
import { DatePartitionDelimiterValue } from 'aws-sdk/clients/dms'

const EXAMPLE_TOKEN = 'f4XghAZSRs6L-RNWRo9-Mw:APA91bFGgAc-0rhMgeHCDvkMJBH_nU4dApG6qqATliEbPs9xXf5n7EJ7FiAjJ6NNCHMBKdqHMdLrkaFHxuShzTwmZquyCjchuVMwAGmlwdXY8vZWnVqvMVItYn5lfIH-mR7Q9FvnNlhv';


export class UserNotificationDto {
  @ApiProperty({
    required: true,
    example: 'b3f99e48-57e6-4d30-a933-1304dad40c62',
  })
  @IsString()
  id!: string

  @ApiProperty({ required: true, example: '1305775399' })
  @IsString()
  @IsNationalId()
  nationalId!: string

  @ApiProperty({ required: true, example: EXAMPLE_TOKEN })
  @IsString()
  deviceToken!: string

  @ApiProperty({ required: true, example: true })
  @IsBoolean()
  @Type(() => Boolean)
  isEnabled!: boolean

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  created!: Date

  @ApiProperty({ type: Date })
  @IsDate()
  @Type(() => Date)
  modified!: Date
}
