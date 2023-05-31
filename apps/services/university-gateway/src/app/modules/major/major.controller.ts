import { Controller, Get, Param, Query } from '@nestjs/common'
import { MajorService } from './major.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { MajorDetails, MajorResponse } from './model'
import { DegreeType, Season } from './types'

@ApiTags('Major')
@Controller()
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get('majors')
  @ApiQuery({
    name: 'limit',
    required: false,
    description:
      'Limits the number of results in a request. The server should have a default value for this field.',
  })
  @ApiQuery({
    name: 'before',
    required: false,
    description:
      'The client provides the value of startCursor from the previous response pageInfo to query the previous page of limit number of data items.',
  })
  @ApiQuery({
    name: 'after',
    required: false,
    description:
      'The client provides the value of endCursor from the previous response to query the next page of limit number of data items.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Param description for year',
  })
  @ApiQuery({
    name: 'season',
    required: false,
    description: 'Param description for season',
    enum: Season,
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'Param description for universityId',
  })
  @ApiQuery({
    name: 'degreeType',
    required: false,
    description: 'Param description for degreeType',
    enum: DegreeType,
  })
  @ApiOkResponse({
    type: MajorResponse,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get majors',
  })
  async getMajors(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('year') year: number,
    @Query('season') season: Season,
    @Query('universityId') universityId: string,
    @Query('degreeType') degreeType: DegreeType,
  ): Promise<MajorResponse> {
    return this.majorService.getMajors(
      { after, before, limit },
      year,
      season,
      universityId,
      degreeType,
    )
  }

  @Get('majors/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: MajorDetails,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get major by id',
  })
  async getMajorDetails(@Param('id') id: string): Promise<MajorDetails> {
    return this.majorService.getMajorDetails(id)
  }

  // TODOx POST MAJOR (single) with courses

  // TODOx PUT MAJOR (single) with courses

  // TODOx DELETE MAJOR (single)
}
