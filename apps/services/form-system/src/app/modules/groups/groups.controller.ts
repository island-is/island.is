import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  NotFoundException,
  Put,
} from '@nestjs/common'
import { GroupsService } from './groups.service'
import { CreateGroupDto } from './models/dto/createGroup.dto'
import { Group } from './models/group.model'
import { Documentation } from '@island.is/nest/swagger'
import { ApiTags } from '@nestjs/swagger'
import { UpdateGroupDto } from './models/dto/updateGroup.dto'
import { GroupDto } from './models/dto/group.dto'

@ApiTags('groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto): Promise<Group> {
    return this.groupsService.create(createGroupDto)
  }

  @Get()
  @Documentation({
    description: 'Get all Groups',
    response: { status: 200, type: [Group] },
  })
  async findAll(): Promise<Group[]> {
    return await this.groupsService.findAll()
  }

  @Get(':id')
  @Documentation({
    description: 'Get Group by id',
    response: { status: 200, type: Group },
  })
  async findOne(@Param('id') id: string): Promise<Group> {
    const group = await this.groupsService.findOne(id)
    if (!group) {
      throw new NotFoundException(`Group not found`)
    }

    return group
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateGroupDto: UpdateGroupDto,
  ): Promise<GroupDto> {
    return await this.groupsService.update(id, updateGroupDto)
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.groupsService.delete(id)
  }
}
