import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'

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
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  // ORGANISATION
  async getOrganisations(): Promise<Organisation[] | null> {
    return await this.organisationModel.findAll()
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
  ): Promise<Organisation> {
    this.logger.debug(
      `Creating organisation with nationalId - ${organisation.nationalId}`,
    )
    console.log(JSON.stringify(organisation))
    return this.organisationModel.create(organisation, {
      include: [AdministrativeContact, TechnicalContact, Helpdesk],
    })
  }

  async updateOrganisation(
    id: string,
    update: UpdateOrganisationDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedOrganisation: Organisation
  }> {
    this.logger.debug(`Updating organisation ${id}`)

    const [
      numberOfAffectedRows,
      [updatedOrganisation],
    ] = await this.organisationModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedOrganisation }
  }

  // PROVIDER
  async getProviders(): Promise<Provider[] | null> {
    return await this.providerModel.findAll({ include: [Organisation] })
  }

  async findProviderById(id: string): Promise<Provider | null> {
    this.logger.debug(`Finding provider with id "${id}"`)
    return this.providerModel.findOne({
      where: { id },
    })
  }

  async createProvider(provider: CreateProviderDto): Promise<Provider> {
    this.logger.debug(
      `Creating provider with id ${provider.id} for organisation ${provider.organisationId}`,
    )

    const organisation = await this.organisationModel.findOne({
      where: { id: provider.organisationId },
    })

    if (organisation === null) {
      throw new NotFoundException(
        `Organisation with id ${provider.organisationId} doesn't exist`,
      )
    }

    return await this.providerModel.create(provider)
  }

  async updateProvider(
    id: string,
    update: UpdateProviderDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedProvider: Provider
  }> {
    this.logger.debug(`Updating provider ${id}`)

    const [
      numberOfAffectedRows,
      [updatedProvider],
    ] = await this.providerModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedProvider }
  }

  // ADMINISTRATIVE CONTACT
  async createAdministrativeContact(
    organisationId: string,
    contact: CreateContactDto,
  ): Promise<AdministrativeContact> {
    this.logger.debug(`Creating administrative contact`)

    return await this.administrativeContactModel.create({
      organisationId,
      ...contact,
    })
  }

  async updateAdministrativeContact(
    id: string,
    update: UpdateContactDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedContact: AdministrativeContact
  }> {
    this.logger.debug(`Updating administrativeContact ${id}`)

    const [
      numberOfAffectedRows,
      [updatedContact],
    ] = await this.administrativeContactModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedContact }
  }

  // TECHNICAL CONTACT
  async createTechnicalContact(
    organisationId: string,
    contact: CreateContactDto,
  ): Promise<TechnicalContact> {
    this.logger.debug(`Creating technical contact`)

    return await this.technicalContactModel.create({
      organisationId,
      ...contact,
    })
  }

  async updateTechnicalContact(
    id: string,
    update: UpdateContactDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedContact: TechnicalContact
  }> {
    this.logger.debug(`Updating technical contact ${id}`)

    const [
      numberOfAffectedRows,
      [updatedContact],
    ] = await this.technicalContactModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedContact }
  }

  // HELPDESK
  async createHelpdesk(
    organisationId: string,
    helpdesk: CreateHelpdeskDto,
  ): Promise<Helpdesk> {
    this.logger.debug(`Creating helpdesk`)

    return await this.helpdeskModel.create({
      organisationId,
      ...helpdesk,
    })
  }

  async updateHelpdesk(
    id: string,
    update: UpdateHelpdeskDto,
  ): Promise<{
    numberOfAffectedRows: number
    updatedHelpdesk: Helpdesk
  }> {
    this.logger.debug(`Updating helpdesk ${id}`)

    const [
      numberOfAffectedRows,
      [updatedHelpdesk],
    ] = await this.helpdeskModel.update(update, {
      where: { id },
      returning: true,
    })

    return { numberOfAffectedRows, updatedHelpdesk }
  }
}
