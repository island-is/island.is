import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { PersonalRepresentativeScopePermission } from '../entities/models/personal-representative-scope-permission.model'
import { PersonalRepresentativeScopePermissionDTO } from '../entities/dto/personal-representative-scope-permission.dto'

@Injectable()
export class PersonalRepresentativeScopePermissionService {
  constructor(
    @InjectModel(PersonalRepresentativeScopePermission)
    private prScopePermissionModel: typeof PersonalRepresentativeScopePermission,
  ) {}

  async getScopePermissionsAsync(
    apiScopeName: string,
  ): Promise<PersonalRepresentativeScopePermission[] | null> {
    return this.prScopePermissionModel.findAll({
      where: { apiScopeName },
    })
  }

  async createScopePermissionAsync(
    scopePermission: PersonalRepresentativeScopePermissionDTO,
  ): Promise<PersonalRepresentativeScopePermission | null> {
    return await this.prScopePermissionModel.create({
      rightTypeCode: scopePermission.permission,
      apiScopeName: scopePermission.apiScopeName,
    })
  }

  async deleteScopePermissionAsync(id: string): Promise<void> {
    const item = await this.prScopePermissionModel.findOne({
      where: { id },
    })
    await item?.destroy()
  }
}
