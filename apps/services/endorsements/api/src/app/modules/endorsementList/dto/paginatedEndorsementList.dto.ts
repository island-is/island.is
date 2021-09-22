import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from '../../pagination/dto/pageinfo.dto';
import { EndorsementListDto } from './endorsementList.dto';



  export class PaginatedEndorsementListDto {
    @ApiProperty({ example: 123})
    totalCount!: number
    @ApiProperty()
    data!: EndorsementListDto
    @ApiProperty({ type: PageInfoDto})
    pageInfo!: PageInfoDto
  
  }