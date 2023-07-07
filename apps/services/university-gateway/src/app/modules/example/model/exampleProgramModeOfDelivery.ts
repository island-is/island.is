import { ApiProperty } from '@nestjs/swagger'
import { ModeOfDelivery } from '../../program/types'

export class ExampleProgramModeOfDelivery {
  // @ApiProperty({
  //   description: 'Program ID',
  //   example: '00000000-0000-0000-0000-000000000000',
  // })
  // programId!: string

  @ApiProperty({
    description: 'Modes of deliveries available for the program',
    example: ModeOfDelivery.ON_SITE,
    enum: ModeOfDelivery,
  })
  modeOfDelivery!: ModeOfDelivery
}
