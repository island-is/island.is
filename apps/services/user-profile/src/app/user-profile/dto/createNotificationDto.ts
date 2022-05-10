import { IsNotEmpty, IsString } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true, example: 'Kominn tími á skoðun?' })
  readonly title!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    required: true,
    example: 'Gaur, hvar er bíllinn þinn? kv,Samgöngustofa',
  })
  readonly content!: string

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false, example: '/minarsidur/okutaeki' })
  readonly action_url!: string
}
