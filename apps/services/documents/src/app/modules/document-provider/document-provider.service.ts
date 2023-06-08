import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { isUuid } from 'uuidv4'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'

import { Provider } from './models/provider.model'
import { CreateProviderDto } from './dto/createProvider.dto'
import { CreateOrganisationDto } from './dto/createOrganisation.dto'
import { Organisation } from './models/organisation.model'
import { UpdateOrganisationDto } from './dto/updateOrganisation.dto'
import { UpdateProviderDto } from './dto/updateProvider.dto'
import { CreateContactDto } from './dto/createContact.dto'
import { AdministrativeContact } from './models/administrativeContact.model'
import { UpdateContactDto } from './dto/updateContact.dto'
import { TechnicalContact } from './models/technicalContact.model'
import { Helpdesk } from './models/helpdesk.model'
import { CreateHelpdeskDto } from './dto/createHelpdesk.dto'
import { UpdateHelpdeskDto } from './dto/updateHelpdesk.dto'
import { Changelog } from './models/changelog.model'

@Injectable()
export class DocumentProviderService {
  constructor(
    @InjectModel(Provider)
    private providerModel: typeof Provider,
    @InjectModel(Organisation)
    private organisationModel: typeof Organisation,
    @InjectModel(AdministrativeContact)
    private administrativeContactModel: typeof AdministrativeContact,
    @InjectModel(TechnicalContact)
    private technicalContactModel: typeof TechnicalContact,
    @InjectModel(Helpdesk)
    private helpdeskModel: typeof Helpdesk,
    @InjectModel(Changelog)
    private changelogModel: typeof Changelog,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // ORGANISATION
  async getOrganisations(): Promise<Organisation[]> {
    return this.organisationModel.findAll()
  }

  async getOrganisationById(id: string): Promise<Organisation | null> {
    return this.organisationModel.findOne({
      where: { id },
    })
  }

  async findOrganisationByNationalId(
    nationalId: string,
  ): Promise<Organisation | null> {
    this.logger.debug(`Finding organisation for nationalId - "${nationalId}"`)
    return this.organisationModel.findOne({
      where: { nationalId },
      include: [Provider, AdministrativeContact, TechnicalContact, Helpdesk],
    })
  }

  async createOrganisation(
    organisation: CreateOrganisationDto,
    modifiedBy: string,
  ): Promise<Organisation> {
    this.logger.debug(
      `Creating organisation with nationalId - ${organisation.nationalId}`,
    )

    // Add modified by to sub-objects, but only if they exists in the CreateOrganisationDto
    // since it is allowed to add organisation without sub-objects
    const org = organisation as Organisation

    if (
      org &&
      'administrativeContact' in organisation &&
      org.administrativeContact
    ) {
      org.administrativeContact.modifiedBy = modifiedBy
    }

    if (org && 'technicalContact' in organisation && org.technicalContact) {
      org.technicalContact.modifiedBy = modifiedBy
    }

    if (org && 'helpdesk' in organisation && org.helpdesk) {
      org.helpdesk.modifiedBy = modifiedBy
    }

    return this.organisationModel.create(
      { ...org, modifiedBy },
      {
        include: [AdministrativeContact, TechnicalContact, Helpdesk],
      },
    )
  }

  async updateOrganisation(
    id: string,
    update: UpdateOrganisationDto,
    modifiedBy: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedOrganisation: Organisation
  }> {
    this.logger.debug(`Updating organisation ${id}`)

    const [numberOfAffectedRows, [updatedOrganisation]] =
      await this.organisationModel.update(
        { ...update, modifiedBy },
        {
          where: { id },
          returning: true,
          individualHooks: true,
        },
      )

    return { numberOfAffectedRows, updatedOrganisation }
  }

  async isLastModifierOfOrganisation(
    organisationNationalId: string,
    modifier: string,
  ): Promise<boolean> {
    const org = await this.organisationModel.findOne({
      where: { nationalId: organisationNationalId, modifiedBy: modifier },
    })

    return org ? true : false
  }

  // PROVIDER
  async getProviders(): Promise<Provider[]> {
    return this.providerModel.findAll({ include: [Organisation] })
  }

  async findProviderById(id: string): Promise<Provider | null> {
    this.logger.debug(`Finding provider with id "${id}"`)
    if (!isUuid(id)) return null

    return this.providerModel.findOne({
      where: { id },
    })
  }

  async findProviderByExternalProviderId(
    externalProviderId: string,
  ): Promise<Provider | null> {
    return this.providerModel.findOne({
      where: { externalProviderId },
    })
  }

  async createProvider(
    provider: CreateProviderDto,
    modifiedBy: string,
  ): Promise<Provider> {
    this.logger.debug(
      `Creating provider for organisation ${provider.organisationId}`,
    )

    const organisation = await this.organisationModel.findOne({
      where: { id: provider.organisationId },
    })

    if (organisation === null) {
      throw new NotFoundException(
        `Organisation with id ${provider.organisationId} doesn't exist`,
      )
    }
    return this.providerModel.create({ ...provider, modifiedBy })
  }

  async updateProvider(
    id: string,
    update: UpdateProviderDto,
    modifiedBy: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedProvider: Provider
  }> {
    this.logger.debug(`Updating provider ${id}`)

    const [numberOfAffectedRows, [updatedProvider]] =
      await this.providerModel.update(
        { ...update, modifiedBy },
        {
          where: { id },
          returning: true,
          individualHooks: true,
        },
      )

    return { numberOfAffectedRows, updatedProvider }
  }

  async getOrganisationsProviders(id: string): Promise<Provider[]> {
    const organisation = await this.organisationModel.findOne({
      where: { id },
      include: [Provider],
    })

    return organisation?.providers ?? []
  }

  // ADMINISTRATIVE CONTACT
  async createAdministrativeContact(
    organisationId: string,
    contact: CreateContactDto,
    modifiedBy: string,
  ): Promise<AdministrativeContact> {
    this.logger.debug(`Creating administrative contact`)

    return this.administrativeContactModel.create({
      organisationId,
      ...contact,
      modifiedBy,
    })
  }

  async updateAdministrativeContact(
    id: string,
    update: UpdateContactDto,
    modifiedBy: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedContact: AdministrativeContact
  }> {
    this.logger.debug(`Updating administrativeContact ${id}`)

    const [numberOfAffectedRows, [updatedContact]] =
      await this.administrativeContactModel.update(
        { ...update, modifiedBy },
        {
          where: { id },
          returning: true,
          individualHooks: true,
        },
      )

    return { numberOfAffectedRows, updatedContact }
  }

  // TECHNICAL CONTACT
  async createTechnicalContact(
    organisationId: string,
    contact: CreateContactDto,
    modifiedBy: string,
  ): Promise<TechnicalContact> {
    this.logger.debug(`Creating technical contact`)

    return this.technicalContactModel.create({
      organisationId,
      ...contact,
      modifiedBy,
    })
  }

  async updateTechnicalContact(
    id: string,
    update: UpdateContactDto,
    modifiedBy: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedContact: TechnicalContact
  }> {
    this.logger.debug(`Updating technical contact ${id}`)

    const [numberOfAffectedRows, [updatedContact]] =
      await this.technicalContactModel.update(
        { ...update, modifiedBy },
        {
          where: { id },
          returning: true,
          individualHooks: true,
        },
      )

    return { numberOfAffectedRows, updatedContact }
  }

  // HELPDESK
  async createHelpdesk(
    organisationId: string,
    helpdesk: CreateHelpdeskDto,
    modifiedBy: string,
  ): Promise<Helpdesk> {
    this.logger.debug(`Creating helpdesk`)

    return this.helpdeskModel.create({
      organisationId,
      ...helpdesk,
      modifiedBy,
    })
  }

  async updateHelpdesk(
    id: string,
    update: UpdateHelpdeskDto,
    modifiedBy: string,
  ): Promise<{
    numberOfAffectedRows: number
    updatedHelpdesk: Helpdesk
  }> {
    this.logger.debug(`Updating helpdesk ${id}`)

    const [numberOfAffectedRows, [updatedHelpdesk]] =
      await this.helpdeskModel.update(
        { ...update, modifiedBy },
        {
          where: { id },
          returning: true,
          individualHooks: true,
        },
      )

    return { numberOfAffectedRows, updatedHelpdesk }
  }

  // CHANGELOGS
  async getChangelogsByOrganisationId(
    organisationId: string,
  ): Promise<Changelog[]> {
    return this.changelogModel.findAll({ where: { organisationId } })
  }

  async getChangelogsByOrganisationIdAndEntityId(
    organisationId: string,
    entityId: string,
  ): Promise<Changelog[]> {
    return this.changelogModel.findAll({
      where: { organisationId, entityId },
    })
  }
}
