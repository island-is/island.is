import { ApiProperty } from '@nestjs/swagger'

export class InternalCaseResponse {
  @ApiProperty({ type: String })
  courtCaseNumber!: string

  @ApiProperty({ type: Object })
  defendants!: {
    name: string
    nationalId: string
    address: string
    defenderName: string
    defenderEmail: string
    defenderPhoneNumber: string
  }[] // TODO: Better types

  @ApiProperty({ type: Object })
  court!: {
    name: string
  }

  @ApiProperty({ type: Object })
  judge!: {
    name: string
    institution: string
  }

  @ApiProperty({ type: Object })
  prosecutorsOffice!: {
    name: string
  }

  @ApiProperty({ type: Object })
  prosecutor!: {
    name: string
    institution: string
  }
}
