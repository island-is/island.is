import { Injectable } from '@nestjs/common'
import { Group } from './models/group.model'
import { InjectModel } from '@nestjs/sequelize'
import { Input } from '../inputs/models/input.model'
import { CreateGroupDto } from './models/dto/createGroup.dto'

@Injectable()
export class GroupsService {
  constructor(
    @InjectModel(Group)
    private readonly groupModel: typeof Group,
  ) {}

  async findAll(): Promise<Group[]> {
    return await this.groupModel.findAll()
  }

  async findOne(id: string): Promise<Group | null> {
    const group = await this.groupModel.findByPk(id, { include: [Input] })

    return group
  }

  async create(createGroupDto: CreateGroupDto): Promise<Group> {
    const group = createGroupDto as Group
    const newGroup: Group = new this.groupModel(group)
    return await newGroup.save()
  }
}
