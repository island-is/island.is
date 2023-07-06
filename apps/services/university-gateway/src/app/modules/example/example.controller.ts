import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'
import { ExampleService } from './example.service'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { ExampleApplicationResponse, ExampleProgramResponse } from './model'
import { CreateApplicationDto } from './dto'
import { UpdateApplicationDto } from './dto/updateApplicationDto'

@ApiTags('Example endpoints for universities')
@Controller({ path: 'example' })
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('active-programs')
  @ApiOkResponse({
    type: ExampleProgramResponse,
    description: 'Returns all active programs',
  })
  @ApiOperation({
    summary: 'Get all active programs',
  })
  async getActivePrograms(): Promise<ExampleProgramResponse> {
    throw Error('Dummy endpoint')
  }

  @Get('applications/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiOkResponse({
    type: ExampleApplicationResponse,
    description: 'Returns the updated application data',
  })
  @ApiOperation({
    summary: 'Get application data',
  })
  async getApplicationStatus(): Promise<ExampleApplicationResponse> {
    throw Error('Dummy endpoint')
  }

  @Post('applications')
  @ApiBody({
    type: CreateApplicationDto,
  })
  @ApiCreatedResponse({
    type: String,
    description: 'TBD',
  })
  @ApiOperation({
    summary: 'Create application in university DB',
  })
  async createApplication(
    @Body() applicationDto: CreateApplicationDto,
  ): Promise<string> {
    throw Error('Dummy endpoint')
  }

  @Patch('applications/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiBody({
    type: UpdateApplicationDto,
  })
  @ApiOkResponse({
    type: String,
    description: 'TBD',
  })
  @ApiOperation({
    summary:
      'Update application status. Used when student accepts/rejects/cancels.',
  })
  async updateApplication(
    @Param('id') id: string,
    @Body() applicationDto: UpdateApplicationDto,
  ): Promise<string> {
    throw Error('Dummy endpoint')
  }
}
