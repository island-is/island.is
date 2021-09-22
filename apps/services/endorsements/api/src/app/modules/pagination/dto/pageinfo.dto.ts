import { ApiProperty } from '@nestjs/swagger';


export class PageInfoDto {
  @ApiProperty({ example: true})
  hasNextPage!: boolean;

  @ApiProperty({ example: false})
  hasPreviousPage!: boolean;

  @ApiProperty({ example: "WyIwM2JmMWUwOS1hNWEwLTQyNDMtOTAxOC1mY2FhYjg4NTVkMTYiXQ=="})
  startCursor!: string;

  @ApiProperty({ example: "WyJmODY1MDAzMS03YTFkLTRhOTAtOWI2OC00ODg1YjlkZDZjZDgiXQ=="})
  endCursor!: string;
  
}