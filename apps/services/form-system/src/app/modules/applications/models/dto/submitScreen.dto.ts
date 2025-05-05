import { ApiPropertyOptional } from "@nestjs/swagger";
import { ScreenDto } from "../../../screens/models/dto/screen.dto";

export class SubmitScreenDto {
  @ApiPropertyOptional()
  applicationId?: string

  @ApiPropertyOptional()
  
  screenDto?: ScreenDto
}