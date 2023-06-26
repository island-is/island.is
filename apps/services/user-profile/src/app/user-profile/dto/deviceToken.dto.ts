import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

const EXAMPLE_TOKEN =
  'f4XghAZSRs6L-RNWRo9-Mw:APA91bFGgAc-0rhMgeHCDvkMJBH_nU4dApG6qqATliEbPs9xXf5n7EJ7FiAjJ6NNCHMBKdqHMdLrkaFHxuShzTwmZquyCjchuVMwAGmlwdXY8vZWnVqvMVItYn5lfIH-mR7Q9FvnNlhv'

export class DeviceTokenDto {
  @ApiProperty({
    required: true,
    example: EXAMPLE_TOKEN,
  })
  @IsString()
  deviceToken!: string
}
