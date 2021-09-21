import { ApiProperty } from '@nestjs/swagger';

export class PageInfoDto {
  @ApiProperty()
  hasNextPage: boolean | undefined;

  @ApiProperty()
  hasPreviousPage: boolean | undefined;

  @ApiProperty()
  startCursor: string | undefined;

  @ApiProperty()
  endCursor: string | undefined;
  
}