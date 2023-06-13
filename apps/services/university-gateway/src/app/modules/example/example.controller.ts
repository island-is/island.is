import { Controller, Get } from '@nestjs/common'
import { ExampleService } from './example.service'
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ExampleMajorResponse } from './model'
import { ExampleApplicationStatusResponse } from './model/exampleApplicationStatus'

@ApiTags('Example endpoints for universities')
@Controller()
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get('active-majors')
  @ApiOkResponse({
    type: ExampleMajorResponse,
    description: 'Returns all active majors',
  })
  @ApiOperation({
    summary: 'Get all active majors',
  })
  async getActiveMajors(): Promise<ExampleMajorResponse> {
    throw Error('Dummy endpoint')
  }

  @Get('application/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Application ID',
  })
  @ApiOkResponse({
    type: ExampleApplicationStatusResponse,
    description: 'Returns the updated application data',
  })
  @ApiOperation({
    summary: 'Get application data',
  })
  async getApplicationStatus(): Promise<ExampleApplicationStatusResponse> {
    throw Error('Dummy endpoint')
  }
}
