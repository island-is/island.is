import { IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class GrantDTO {
    @IsString()
    @ApiProperty({
      example: 'set_key',
    })
    readonly key: string
  
    @IsString()
    @ApiProperty({
      example: 'set_clientId',
    })
    readonly clientId: string
  
    @IsString()
    @ApiProperty({
      example: 'set_data',
    })
    readonly data: string
  
    @IsString()
    @ApiProperty({
      // add one day as an expiration example
      example: new Date(new Date().setTime( new Date().getTime() + 86400000 )) //86400000 = nr of ms in one day
    })
    readonly expiration: string
  
    @IsString()
    @ApiProperty({
      example: 'set_subject_id',
    })
    readonly subject_id: string
  
    @IsString()
    @ApiProperty({
      example: 'set_type',
    })
    readonly type: string
  }