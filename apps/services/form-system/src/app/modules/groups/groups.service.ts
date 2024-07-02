import { Injectable, NotFoundException } from '@nestjs/common'
import { Group } from './models/group.model'
import { InjectModel } from '@nestjs/sequelize'
import { Input } from '../inputs/models/input.model'
import { CreateGroupDto } from './models/dto/createGroup.dto'
import { UpdateGroupDto } from './models/dto/updateGroup.dto'
import { GroupDto } from './models/dto/group.dto'

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private readonly groupModel: typeof Group,
  ) {}

  async findAll(): Promise<Group[]> {
    return await this.groupModel.findAll()
  }

  async findOne(id: string): Promise<Group> {
    const group = await this.groupModel.findByPk(id, { include: [Input] })

    if (!group) {
      throw new NotFoundException(`Group with id '${id}' not found`)
    }

    return group
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = createGroupDto as Group
    const newGroup: Group = new this.groupModel(group)
    return await newGroup.save()
  }

  async update(id: string, updateGroupDto: UpdateGroupDto): Promise<GroupDto> {
    const group = await this.findOne(id)

    group.name = updateGroupDto.name
    group.multiset = updateGroupDto.multiset
    group.modified = new Date()

    await group.save()

    const groupDto: GroupDto = {
      id: group.id,
      stepId: group.stepId,
      name: group.name,
      displayOrder: group.displayOrder,
      multiset: group.multiset,
    }

    return groupDto
  }

  async delete(id: string): Promise<void> {
    const group = await this.findOne(id)
    group?.destroy()
  }
}
