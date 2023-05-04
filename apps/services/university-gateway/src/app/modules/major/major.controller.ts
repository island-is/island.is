import { Controller, Get, Param, Query } from '@nestjs/common'
import { MajorService } from './major.service'
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import {
  DegreeTypeEnum,
  MajorDetails,
  Major,
  SeasonEnum,
  University,
} from './major.model'

@ApiTags('Major')
@Controller()
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get('universities')
  @ApiOkResponse({
    type: [University],
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get universities',
  })
  async getUniversities(): Promise<University[]> {
    return this.majorService.getUniversities()
  }

  @Get('majors')
  @ApiQuery({
    name: 'year',
    required: false,
    description: 'Param description for year',
  })
  @ApiQuery({
    name: 'season',
    required: false,
    description: 'Param description for season',
    enum: SeasonEnum,
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
    enum: DegreeTypeEnum,
  })
  @ApiOkResponse({
    type: [Major],
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get majors',
  })
  async getMajors(
    @Query('year') year: number,
    @Query('season') season: SeasonEnum,
    @Query('universityId') universityId: string,
    @Query('degreeType') degreeType: DegreeTypeEnum,
  ): Promise<Major[]> {
    return this.majorService.getMajors(year, season, universityId, degreeType)
  }

  @Get('major/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: Major,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get major',
  })
  async getMajor(@Param('id') id: string): Promise<Major> {
    return this.majorService.getMajor(id)
  }

  @Get('major/:id/details')
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
    summary: 'Endpoint description for get major details',
  })
  async getMajorDetails(@Param('id') id: string): Promise<MajorDetails> {
    return this.majorService.getMajorDetails(id)
  }
}
