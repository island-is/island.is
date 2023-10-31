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
import { ProgramResponse } from './dto/programResponse'
import { ProgramDetailsResponse } from './dto/programDetailsResponse'
import { TagResponse } from './dto/tagResponse'
import { DegreeType, Season } from '@island.is/university-gateway'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('Program')
@Controller({
  version: ['1'],
})
export class ProgramController {
  constructor(private readonly programService: ProgramService) {}

  @BypassAuth()
  @Get('programs')
  @Documentation({
    description: 'Get all programs',
    response: {
      status: 200,
      type: ProgramResponse,
    },
    request: {
      query: {
        limit: {
          type: 'number',
          description:
            'Limits the number of results in a request. The server should have a default value for this field.',
          required: false,
        },
        before: {
          type: 'string',
          description:
            'The client provides the value of startCursor from the previous response pageInfo to query the previous page of limit number of data items.',
          required: false,
        },
        after: {
          type: 'string',
          description:
            'The client provides the value of endCursor from the previous response to query the next page of limit number of data items.',
          required: false,
        },
        active: {
          type: 'boolean',
          description:
            'If true, will return only active programs. If false, will return only inactive programs. If undefined, will return both active and inactive.',
          required: false,
        },
        year: {
          type: 'number',
          description: 'Starting semester year',
          required: false,
        },
        season: {
          enum: Season,
          enumName: 'Season',
          description: 'Starting semester season',
          required: false,
        },
        universityId: {
          type: 'string',
          description: 'University ID',
          required: false,
        },
        degreeType: {
          enum: DegreeType,
          enumName: 'DegreeType',
          description: 'Degree type',
          required: false,
        },
      },
    },
  })
  getPrograms(
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
      limit,
      after,
      before,
      active,
      year,
      season,
      universityId,
      degreeType,
    )
  }

  @BypassAuth()
  @Get('programs/:id')
  @Documentation({
    description: 'Get program (and courses) by ID',
    response: {
      status: 200,
      type: ProgramDetailsResponse,
    },
    request: {
      params: {
        id: {
          type: 'string',
          description: 'Program ID',
          required: true,
        },
      },
    },
  })
  getProgramDetails(@Param('id') id: string): Promise<ProgramDetailsResponse> {
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
  getTags(): Promise<TagResponse> {
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
  getDurationInYears(): Promise<string[]> {
    return this.programService.getDurationInYears()
  }
}
