import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty } from "class-validator";

export class sendPdfEmailResponse {
    @ApiProperty()
    @IsBoolean()
    success!: boolean;
}