import { Controller, Get, Param, Query } from '@nestjs/common'
import { MajorService } from './major.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { MajorDetailsResponse, MajorResponse } from './model'
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
    name: 'active',
    required: false,
    description:
      'If true, will return only active majors. If false, will return only inactive majors. If undefined, will return both active and inactive.',
  })
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Starting semester year',
  })
  @ApiQuery({
    name: 'season',
    required: false,
    description: 'Starting semester season',
    enum: Season,
  })
  @ApiQuery({
    name: 'universityId',
    required: false,
    description: 'University ID',
  })
  @ApiQuery({
    name: 'degreeType',
    required: false,
    description: 'Degree type',
    enum: DegreeType,
  })
  @ApiOkResponse({
    type: MajorResponse,
    description: 'Returns all majors for the selected filtering',
  })
  @ApiOperation({
    summary: 'Get all majors',
  })
  async getMajors(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('active') active: boolean,
    @Query('year') year: number,
    @Query('season') season: Season,
    @Query('universityId') universityId: string,
    @Query('degreeType') degreeType: DegreeType,
  ): Promise<MajorResponse> {
    return this.majorService.getMajors(
      { after, before, limit },
      active,
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
    description: 'Major ID',
  })
  @ApiOkResponse({
    type: MajorDetailsResponse,
    description: 'Returns the major by ID',
  })
  @ApiOperation({
    summary: 'Get major (and courses) by ID',
  })
  async getMajorDetails(
    @Param('id') id: string,
  ): Promise<MajorDetailsResponse> {
    return this.majorService.getMajorDetails(id)
  }
}
