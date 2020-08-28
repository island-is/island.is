import { GrantsService } from './grants.service';
import {
    Controller,
    Get,
    NotFoundException,
    Param,
  } from '@nestjs/common'
  import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { string } from 'yargs'
  
  @ApiTags('grants')
  @Controller('grants')
  export class GrantsController {
    constructor(private readonly grantsService: GrantsService) {}
  
    @Get()
    @ApiOkResponse({ type: string })
    testString(): string {
      return this.grantsService.testString()
    }

    // @Get(':clientId')
    // @ApiOkResponse({ type: string })
    // async findOne(@Param('clientId') clientId: string): Promise<Client> {
    //   const clientProfile = await this.clientsService.findClientById(clientId)
  
    //   if (!clientProfile) {
    //     throw new NotFoundException("This client doesn't exist")
    //   }
  
    //   return clientProfile
    // }
  
  }
  