import {ApiProperty} from "@nestjs/swagger";
import {Expose} from "class-transformer";
import {IsArray, IsNumber} from "class-validator";
import {
  ApplicationListAdminResponseDto
} from "../../../../../apps/application-system/api/src/app/modules/application/dto/applicationAdmin.response.dto";


//todo: skilgreina shared type fyrir skil
//Byggjum á applicationAdmin.response.dto.ts en þurfum líklegast að skilgreina sér týpu.
//Þurfum þá að skoða hvort einhver gögn eigi ekki erindi

export class AdminApplicationCardDto {
  @ApiProperty({ type: [ApplicationListAdminResponseDto] })
  @Expose()
  @IsArray()
  rows!: ApplicationListAdminResponseDto[]

  @ApiProperty()
  @Expose()
  @IsNumber()
  count!: number
}
