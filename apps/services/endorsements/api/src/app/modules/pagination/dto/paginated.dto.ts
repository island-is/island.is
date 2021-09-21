import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from './pageinfo.dto';

export class PaginatedDto<TData> {
  @ApiProperty()
  pageInfo: PageInfoDto | undefined

  data: TData[] | undefined;
}