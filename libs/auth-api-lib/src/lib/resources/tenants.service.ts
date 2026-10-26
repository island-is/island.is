import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Op, Transaction, UniqueConstraintError } from 'sequelize'

import { User } from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { NoContentException } from '@island.is/nest/problem'

import { Client } from '../clients/models/client.model'
import { TranslationService } from '../translation/translation.service'
import { AdminCreateTenantDto } from './dto/admin-create-tenant.dto'
import { AdminPatchTenantDto } from './dto/admin-patch-tenant.dto'
import { AdminTenantDto } from './dto/admin-tenant.dto'
import { TenantDto } from './dto/tenant.dto'
import { ApiScopeGroup } from './models/api-scope-group.model'
import { ApiScope } from './models/api-scope.model'
import { Domain } from './models/domain.model'

const ADMIN_TENANT_ID = '@admin.island.is'
const TRANSLATION_CLASS_NAME = 'domain'
const EN = 'en'

/**
 * This is a service that is used to access the tenant resource.
 * (Previously known as domains).
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectModel(Domain)
    private readonly domainModel: typeof Domain,
    @InjectModel(Client)
    private readonly clientModel: typeof Client,
    @InjectModel(ApiScope)
    private readonly apiScopeModel: typeof ApiScope,
    @InjectModel(ApiScopeGroup)
    private readonly apiScopeGroupModel: typeof ApiScopeGroup,
    private readonly translationService: TranslationService,
  ) {}

  async findAllPublic(): Promise<TenantDto[]> {
    const tenants = await this.domainModel.findAll({
      where: {
        name: { [Op.ne]: ADMIN_TENANT_ID },
        nationalId: { [Op.ne]: '' },
      },
      attributes: ['name', 'displayName', 'nationalId'],
      include: [
        {
          model: ApiScope,
          as: 'scopes',
          attributes: [],
          required: true,
          where: {
            enabled: true,
            allowExplicitDelegationGrant: true,
            archived: null,
          },
        },
      ],
    })

    return tenants.map((tenant) => ({
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
      nationalId: tenant.nationalId,
    }))
  }

  async findAllByUser(user: User): Promise<TenantDto[]> {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenants = await this.domainModel.findAll({
      ...(!isSuperUser && {
        where: {
          nationalId: user.nationalId,
        },
      }),
      attributes: ['name', 'displayName', 'nationalId'],
    })

    return tenants
      .sort((a, b) => a.name.localeCompare(b.name, 'is'))
      .map((tenant) => ({
        name: tenant.name,
        displayName: [{ locale: 'is', value: tenant.displayName }],
        nationalId: tenant.nationalId,
      }))
  }

  async findById(id: string): Promise<TenantDto> {
    const tenant = await this.domainModel.findOne({
      where: { name: id },
      attributes: ['name', 'displayName', 'contactEmail', 'nationalId'],
    })

    if (!tenant) {
      throw new NoContentException()
    }

    return {
      name: tenant.name,
      displayName: [{ locale: 'is', value: tenant.displayName }],
      contactEmail: tenant.contactEmail,
      nationalId: tenant.nationalId,
    }
  }

  /** Returns all editable tenant fields, including English translations. */
  async findByIdForAdmin(id: string): Promise<AdminTenantDto> {
    const tenant = await this.domainModel.findOne({
      where: { name: id },
    })

    if (!tenant) {
      throw new NoContentException()
    }

    return this.toAdminTenantDto(tenant)
  }

  async hasAccessToTenant(user: User, tenantId: string) {
    const isSuperUser = user.scope.includes(AdminPortalScope.idsAdminSuperUser)

    const tenant = await this.domainModel.findOne({
      where: {
        name: tenantId,
        ...(isSuperUser ? {} : { nationalId: user.nationalId }),
      },
      attributes: ['name'],
    })
    return Boolean(tenant)
  }

  async create(dto: AdminCreateTenantDto): Promise<Domain> {
    const existing = await this.domainModel.findOne({
      where: { name: dto.name },
      attributes: ['name'],
    })

    if (existing) {
      throw new ConflictException(`Tenant "${dto.name}" already exists`)
    }

    try {
      return await this.domainModel.create({ ...dto })
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        throw new ConflictException(`Tenant "${dto.name}" already exists`)
      }
      throw error
    }
  }

  async update(
    name: string,
    dto: AdminPatchTenantDto,
  ): Promise<AdminTenantDto> {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('No fields provided to update')
    }

    const { displayNameEn, descriptionEn, ...domainFields } = dto

    const updated = await this.domainModel.sequelize!.transaction(
      async (transaction) => {
        const existing = await this.domainModel.findOne({
          where: { name },
          transaction,
        })

        if (!existing) {
          throw new NoContentException()
        }

        await Promise.all([
          this.setEnglishTranslation(
            name,
            'displayName',
            displayNameEn,
            transaction,
          ),
          this.setEnglishTranslation(
            name,
            'description',
            descriptionEn,
            transaction,
          ),
        ])

        return Object.keys(domainFields).length > 0
          ? existing.update({ ...domainFields }, { transaction })
          : existing
      },
    )

    return this.toAdminTenantDto(updated, true)
  }

  /**
   * Upserts the English translation of a tenant field. An empty value removes
   * the translation so the Icelandic value is used as fallback.
   */
  private async setEnglishTranslation(
    name: string,
    property: 'displayName' | 'description',
    value: string | null | undefined,
    transaction: Transaction,
  ) {
    if (value === undefined) {
      return
    }

    const translation = {
      className: TRANSLATION_CLASS_NAME,
      key: name,
      language: EN,
      property,
    }

    if (!value?.trim()) {
      await this.translationService.deleteTranslation(translation, transaction)
    } else {
      await this.translationService.upsertTranslation(
        { ...translation, value: value.trim() },
        transaction,
      )
    }
  }

  private async toAdminTenantDto(
    tenant: Domain,
    useMaster = false,
  ): Promise<AdminTenantDto> {
    const translations = await this.translationService.findTranslationMap(
      TRANSLATION_CLASS_NAME,
      [tenant.name],
      useMaster,
      EN,
    )
    const en = translations.get(tenant.name)

    return {
      name: tenant.name,
      nationalId: tenant.nationalId,
      displayName: tenant.displayName,
      displayNameEn: en?.get('displayName'),
      description: tenant.description,
      descriptionEn: en?.get('description'),
      organisationLogoKey: tenant.organisationLogoKey,
      contactEmail: tenant.contactEmail,
      municipalityCode: tenant.municipalityCode,
    }
  }

  async delete(name: string): Promise<void> {
    await this.domainModel.sequelize!.transaction(async (transaction) => {
      const existing = await this.domainModel.findOne({
        where: { name },
        attributes: ['name'],
        transaction,
        lock: transaction.LOCK.UPDATE,
      })

      if (!existing) {
        throw new NoContentException()
      }

      const [clientCount, scopeCount, scopeGroupCount] = await Promise.all([
        this.clientModel.count({ where: { domainName: name }, transaction }),
        this.apiScopeModel.count({ where: { domainName: name }, transaction }),
        this.apiScopeGroupModel.count({
          where: { domainName: name },
          transaction,
        }),
      ])

      if (clientCount + scopeCount + scopeGroupCount > 0) {
        throw new BadRequestException(
          `Cannot delete tenant "${name}": it still has ${clientCount} client(s), ${scopeCount} scope(s) and ${scopeGroupCount} scope group(s) referencing it.`,
        )
      }

      await Promise.all([
        this.setEnglishTranslation(name, 'displayName', null, transaction),
        this.setEnglishTranslation(name, 'description', null, transaction),
      ])
      await this.domainModel.destroy({ where: { name }, transaction })
    })
  }
}
