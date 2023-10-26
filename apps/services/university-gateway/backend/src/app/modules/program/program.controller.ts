import { UseGuards } from '@nestjs/common'
import {
  BypassAuth,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ProgramService } from './program.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ProgramDetailsResponse, ProgramResponse, TagResponse } from './model'
import { DegreeType, Season } from '@island.is/university-gateway'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('Program')
@Controller({
  path: 'programs',
  version: ['1'],
})
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @BypassAuth()
  @Get()
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
      'If true, will return only active programs. If false, will return only inactive programs. If undefined, will return both active and inactive.',
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
    type: ProgramResponse,
    description: 'Returns all programs for the selected filtering',
  })
  @ApiOperation({
    summary: 'Get all programs',
  })
  async getPrograms(
    @Query('limit') limit: number,
    @Query('before') before: string,
    @Query('after') after: string,
    @Query('active') active?: boolean,
    @Query('year') year?: number,
    @Query('season') season?: Season,
    @Query('universityId') universityId?: string,
    @Query('degreeType') degreeType?: DegreeType,
  ): Promise<ProgramResponse> {
    return this.programService.getPrograms(
      { after, before, limit },
      active,
      year,
      season,
      universityId,
      degreeType,
    )
  }

  @BypassAuth()
  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Program ID',
  })
  @ApiOkResponse({
    type: ProgramDetailsResponse,
    description: 'Returns the program by ID',
  })
  @ApiOperation({
    summary: 'Get program (and courses) by ID',
  })
  async getProgramDetails(
    @Param('id') id: string,
  ): Promise<ProgramDetailsResponse> {
    return this.programService.getProgramDetails(id)
  }

  @BypassAuth()
  @Get('tags')
  @ApiOkResponse({
    type: TagResponse,
    description: 'Returns all tags',
  })
  @ApiOperation({
    summary: 'Get all tags',
  })
  async getTags(): Promise<TagResponse> {
    return this.programService.getTags()
  }

  @BypassAuth()
  @Get('duration-in-years')
  @ApiOkResponse({
    type: [String],
    description: 'Returns all possible values for duration in years',
  })
  @ApiOperation({
    summary: 'Get all possible values for duration in years',
  })
  async getDurationInYears(): Promise<string[]> {
    return this.programService.getDurationInYears()
  }
}
