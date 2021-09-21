import { ApiProperty } from '@nestjs/swagger';

export class QueryDto {
  @ApiProperty()
  limit: number | undefined;

  @ApiProperty()
  before: string | undefined;

  @ApiProperty()
  after: string | undefined;


  
}