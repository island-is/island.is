import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { MajorService } from './major.service'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { MajorDetails, MajorDetailsResponse, MajorResponse } from './model'
import { DegreeType, Season } from './types'
import { CreateMajorDto, UpdateMajorDto } from './dto'

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

  @Post('majors')
  @ApiBody({
    type: CreateMajorDto,
  })
  @ApiCreatedResponse({
    type: MajorDetails,
    description: 'Returns the major that was created',
  })
  @ApiOperation({
    summary: 'Create major (and courses)',
  })
  async createMajor(@Body() majorDto: CreateMajorDto): Promise<MajorDetails> {
    return this.majorService.createMajor(majorDto)
  }

  @Put('majors/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Major ID',
  })
  @ApiBody({
    type: UpdateMajorDto,
  })
  @ApiOkResponse({
    type: MajorDetails,
    description: 'Returns the updated major',
  })
  @ApiOperation({
    summary: 'Update major (and courses)',
  })
  async updateMajor(
    @Param('id') id: string,
    @Body() majorDto: UpdateMajorDto,
  ): Promise<MajorDetails> {
    return this.majorService.updateMajor(id, majorDto)
  }

  @Delete('majors/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Major ID',
  })
  @ApiOkResponse({
    type: Number,
    description: 'Returns the number of majors that was deleted',
  })
  @ApiOperation({
    summary: 'Delete major (and courses)',
  })
  async deleteMajor(@Param('id') id: string): Promise<number> {
    return this.majorService.deleteMajor(id)
  }
}
