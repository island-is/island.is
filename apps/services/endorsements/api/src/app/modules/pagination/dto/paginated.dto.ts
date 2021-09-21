import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from './pageinfo.dto';

const pageInfoExample = {
  "hasNextPage": true,
  "hasPreviousPage": false,
  "startCursor": "WyIwM2JmMWUwOS1hNWEwLTQyNDMtOTAxOC1mY2FhYjg4NTVkMTYiXQ==",
  "endCursor": "WyJmODY1MDAzMS03YTFkLTRhOTAtOWI2OC00ODg1YjlkZDZjZDgiXQ=="
}
export class PaginatedDto<TData> {
  @ApiProperty({ example: 123})
  totalcount?: number;
  @ApiProperty()
  data?: TData[];
  @ApiProperty({ example: pageInfoExample})
  pageInfo?: PageInfoDto

}