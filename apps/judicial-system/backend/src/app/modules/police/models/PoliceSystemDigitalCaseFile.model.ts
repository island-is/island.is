import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

export class PoliceSystemDigitalCaseFile {
  // digital file id in the police system
  @ApiProperty({ type: String })
  id!: string

  @ApiProperty({ type: String })
  name!: string

  @ApiProperty({ type: String })
  policeCaseNumber!: string

  @ApiProperty({ type: String })
  policeExternalVendorId!: string

  // This is the date the record was registered in the police digital software.
  // It can represent the actual recording date if the record was recorded directly with the digital software, but for uploaded
  // recording from external systems by system administrator we will not know the recording date...
  // The Police will try to add this date, but that can take a long time
  @ApiPropertyOptional({ type: Date })
  displayDate?: Date
}
