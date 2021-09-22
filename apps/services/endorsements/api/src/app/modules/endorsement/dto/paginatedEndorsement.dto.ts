import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from '../../pagination/dto/pageinfo.dto';
import { EndorsementDto } from './endorsement.dto';



  export class PaginatedEndorsementDto {
    @ApiProperty({ example: 123})
    totalCount!: number
    @ApiProperty({type: [EndorsementDto]})
    data!: EndorsementDto[]
    @ApiProperty({ type: PageInfoDto})
    pageInfo!: PageInfoDto
  
  }