import { AdminPortalScope, ApiScope } from '@island.is/auth/scopes'
import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Audit, AuditService } from '@island.is/nest/audit'

import { Organisation } from '../models/organisation.model'
import { DocumentProviderService } from '../document-provider.service'
import { CreateOrganisationDto } from '../dto/createOrganisation.dto'
import { UpdateOrganisationDto } from '../dto/updateOrganisation.dto'
import { AdministrativeContact } from '../models/administrativeContact.model'
import { CreateContactDto } from '../dto/createContact.dto'
import { UpdateContactDto } from '../dto/updateContact.dto'
import { TechnicalContact } from '../models/technicalContact.model'
import { Helpdesk } from '../models/helpdesk.model'
import { CreateHelpdeskDto } from '../dto/createHelpdesk.dto'
import { UpdateHelpdeskDto } from '../dto/updateHelpdesk.dto'
import { Provider } from '../models/provider.model'
import { environment } from '../../../../environments'

const namespace = `${environment.audit.defaultNamespace}/organisations`

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('organisations')
@ApiHeader({
  name: 'authorization',
  description: 'Bearer token authorization',
})
@Controller('organisations')
@Audit({ namespace })
export class OrganisationController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
    private readonly auditService: AuditService,
  ) {}

  @Get()
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: [Organisation] })
  @Audit<Organisation[]>({
    resources: (organisations) =>
      organisations.map((organisation) => organisation.id),
  })
  async getOrganisations(): Promise<Organisation[]> {
    return this.documentProviderService.getOrganisations()
  }

  @Get(':nationalId')
  @Scopes(ApiScope.internal, AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Organisation })
  @Audit<Organisation>({
    resources: (organisation) => organisation.id,
  })
  async findByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<Organisation> {
    const org = await this.documentProviderService.findOrganisationByNationalId(
      nationalId,
    )

    if (!org) {
      throw new NotFoundException(
        `An organisation with nationalId ${nationalId} does not exist`,
      )
    }

    return org
  }

  @Post()
  @Scopes(AdminPortalScope.documentProvider, ApiScope.internal)
  @ApiCreatedResponse({ type: Organisation })
  @Audit<Organisation>({
    resources: (organisation) => organisation.id,
  })
  async createOrganisation(
    @Body() organisation: CreateOrganisationDto,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    return this.documentProviderService.createOrganisation(
      organisation,
      user.nationalId,
    )
  }

  @Put(':id')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Organisation })
  async updateOrganisation(
    @Param('id') id: string,
    @Body() organisation: UpdateOrganisationDto,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    const { numberOfAffectedRows, updatedOrganisation } =
      await this.documentProviderService.updateOrganisation(
        id,
        organisation,
        user.nationalId,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Organisation ${id} does not exist.`)
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'updateOrganisation',
      resources: id,
      meta: { fields: Object.keys(organisation) },
    })
    return updatedOrganisation
  }

  @Get(':nationalId/islastmodifier')
  @Scopes(ApiScope.internal, AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Boolean })
  @Audit()
  async isLastModifierOfOrganisation(
    @Param('nationalId') organisationNationalId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return this.documentProviderService.isLastModifierOfOrganisation(
      organisationNationalId,
      user.nationalId,
    )
  }

  @Post(':id/administrativecontact')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: AdministrativeContact })
  @Audit<AdministrativeContact>({
    resources: (contact) => contact.id,
    meta: (contact) => ({ organisation: contact.organisationId }),
  })
  async createAdministrativeContact(
    @Param('id') id: string,
    @Body() administrativeContact: CreateContactDto,
    @CurrentUser() user: User,
  ): Promise<AdministrativeContact> {
    return this.documentProviderService.createAdministrativeContact(
      id,
      administrativeContact,
      user.nationalId,
    )
  }

  @Put(':id/administrativecontact/:administrativeContactId')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: AdministrativeContact })
  async updateAdministrativeContact(
    @Param('id') id: string,
    @Param('administrativeContactId') administrativeContactId: string,
    @Body() administrativeContact: UpdateContactDto,
    @CurrentUser() user: User,
  ): Promise<AdministrativeContact> {
    const { numberOfAffectedRows, updatedContact } =
      await this.documentProviderService.updateAdministrativeContact(
        administrativeContactId,
        administrativeContact,
        user.nationalId,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `AdministrativeContact ${administrativeContactId} does not exist.`,
      )
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'updateAdministrativeContact',
      resources: administrativeContactId,
      meta: {
        organisation: id,
        fields: Object.keys(administrativeContact),
      },
    })
    return updatedContact
  }

  @Post(':id/technicalcontact')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: TechnicalContact })
  @Audit<TechnicalContact>({
    resources: (contact) => contact.id,
    meta: (contact) => ({ organisation: contact.organisationId }),
  })
  async createTechnicalContact(
    @Param('id') id: string,
    @Body() technicalContact: CreateContactDto,
    @CurrentUser() user: User,
  ): Promise<TechnicalContact> {
    return this.documentProviderService.createTechnicalContact(
      id,
      technicalContact,
      user.nationalId,
    )
  }

  @Put(':id/technicalcontact/:technicalContactId')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: TechnicalContact })
  async updateTechnicalContact(
    @Param('id') id: string,
    @Param('technicalContactId') technicalContactId: string,
    @Body() technicalContact: UpdateContactDto,
    @CurrentUser() user: User,
  ): Promise<TechnicalContact> {
    const { numberOfAffectedRows, updatedContact } =
      await this.documentProviderService.updateTechnicalContact(
        technicalContactId,
        technicalContact,
        user.nationalId,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `TechnicalContact ${technicalContactId} does not exist.`,
      )
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'updateTechnicalContact',
      resources: technicalContactId,
      meta: {
        organisation: id,
        fields: Object.keys(technicalContact),
      },
    })
    return updatedContact
  }

  @Post(':id/helpdesk')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Helpdesk })
  @Audit<Helpdesk>({
    resources: (helpdesk) => helpdesk.id,
    meta: (helpdesk) => ({ organisation: helpdesk.organisationId }),
  })
  async createHelpdesk(
    @Param('id') id: string,
    @Body() helpdesk: CreateHelpdeskDto,
    @CurrentUser() user: User,
  ): Promise<Helpdesk> {
    return this.documentProviderService.createHelpdesk(
      id,
      helpdesk,
      user.nationalId,
    )
  }

  @Put(':id/helpdesk/:helpdeskId')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: Helpdesk })
  async updateHelpdesk(
    @Param('id') id: string,
    @Param('helpdeskId') helpdeskId: string,
    @Body() helpdesk: UpdateHelpdeskDto,
    @CurrentUser() user: User,
  ): Promise<Helpdesk> {
    const { numberOfAffectedRows, updatedHelpdesk } =
      await this.documentProviderService.updateHelpdesk(
        helpdeskId,
        helpdesk,
        user.nationalId,
      )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Helpdesk ${helpdeskId} does not exist.`)
    }

    this.auditService.audit({
      auth: user,
      namespace,
      action: 'updateHelpdesk',
      resources: helpdeskId,
      meta: {
        organisation: id,
        fields: Object.keys(helpdesk),
      },
    })
    return updatedHelpdesk
  }

  @Get(':id/providers')
  @Scopes(AdminPortalScope.documentProvider)
  @ApiOkResponse({ type: [Provider] })
  @Audit<Provider[]>({
    resources: (providers) => providers.map((provider) => provider.id),
    meta: (providers) => ({
      organisation: providers.length > 0 ? providers[0].organisationId : '',
    }),
  })
  async getOrganisationsProviders(
    @Param('id') organisationId: string,
  ): Promise<Provider[]> {
    return this.documentProviderService.getOrganisationsProviders(
      organisationId,
    )
  }
}
