import { ApiProperty } from '@nestjs/swagger';

export class PageInfoDto {
  @ApiProperty({ example: true})
  hasNextPage?: boolean;

  @ApiProperty({ example: true})
  hasPreviousPage?: boolean;

  @ApiProperty({ example: "abcd"})
  startCursor?: string;

  @ApiProperty({ example: "dcba"})
  endCursor?: string;
  
}