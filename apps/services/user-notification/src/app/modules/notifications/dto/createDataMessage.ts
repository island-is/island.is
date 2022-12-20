import { IsNationalId } from "@island.is/nest/validators";
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsUrl } from "class-validator";


export class CreateDataMessageDto {
  @IsString()
  @ApiProperty({default: "DATA_MESSAGE", required: true})
  type!: string;

  @IsNationalId()
  @ApiProperty({default: "1305775399", required: true})
  recipient!: string;

  @IsString()
  @ApiProperty({default: "titill halló heimur", required: true})
  title!: string;

  @IsString()
  @ApiProperty({default: "lýsing halló halló", required: true})
  body!: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty({default: "https://mail.google.com/mail/u/0/#inbox", required: false})
  appURI?: string;

  @IsOptional()
  @ApiProperty({default: {key:"value"}, required: false})
  data?: object;
}