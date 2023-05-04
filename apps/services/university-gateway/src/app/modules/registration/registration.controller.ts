import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common'
import { RegistrationService } from './registration.service'
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { RegistrationDto, Registration } from './registration.model'

@ApiTags('Registration')
@Controller()
export class RegistrationController {
  constructor(private readonly registrationService: RegistrationService) {}

  @Get('registration/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Param description for id',
  })
  @ApiOkResponse({
    type: Registration,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for get registration',
  })
  async getRegistration(@Param('id') id: string): Promise<Registration> {
    return this.registrationService.getRegistration(id)
  }

  @Post('registration')
  @ApiBody({
    type: RegistrationDto,
  })
  @ApiCreatedResponse({
    type: Registration,
    description: 'Response description for 201',
  })
  @ApiOperation({
    summary: 'Endpoint description for post registration',
  })
  async postRegistration(
    @Body() registrationDto: RegistrationDto,
  ): Promise<Registration> {
    return this.registrationService.postRegistration(registrationDto)
  }

  @Put('registration/:id')
  @ApiParam({
    name: 'id',
    required: true,
    allowEmptyValue: false,
    description: 'Param description for id',
  })
  @ApiBody({
    type: RegistrationDto,
  })
  @ApiOkResponse({
    type: Registration,
    description: 'Response description for 200',
  })
  @ApiOperation({
    summary: 'Endpoint description for put registration',
  })
  async putRegistration(
    @Param('id') id: string,
    @Body() registrationDto: RegistrationDto,
  ): Promise<Registration> {
    return this.registrationService.putRegistration(id, registrationDto)
  }
}
