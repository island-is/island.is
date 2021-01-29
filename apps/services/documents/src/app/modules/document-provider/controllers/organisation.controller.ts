import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger'
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

@ApiTags('organisations')
@Controller('organisations')
export class OrganisationController {
  constructor(
    private readonly documentProviderService: DocumentProviderService,
  ) {}

  @Get()
  @ApiOkResponse({ type: [Organisation] })
  async getOrganisations(): Promise<Organisation[] | null> {
    return await this.documentProviderService.getOrganisations()
  }

  @Get(':nationalId')
  @ApiOkResponse({ type: Organisation })
  async findByNationalId(
    @Param('nationalId') nationalId: string,
  ): Promise<Organisation> {
    const org = await this.documentProviderService.findOrganisationByNationalId(
      nationalId,
    )

    if (!org) {
      throw new NotFoundException("This organisation doesn't exist")
    }

    return org
  }

  @Post()
  @ApiCreatedResponse({ type: Organisation })
  async createOrganisation(
    @Body() organisation: CreateOrganisationDto,
  ): Promise<Organisation> {
    return await this.documentProviderService.createOrganisation(organisation)
  }

  @Put(':id')
  @ApiOkResponse({ type: Organisation })
  async updateOrganisation(
    @Param('id') id: string,
    @Body() organisation: UpdateOrganisationDto,
  ): Promise<Organisation> {
    const {
      numberOfAffectedRows,
      updatedOrganisation,
    } = await this.documentProviderService.updateOrganisation(id, organisation)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Organisation ${id} does not exist.`)
    }

    return updatedOrganisation
  }

  @Post(':id/administrativecontact')
  @ApiOkResponse({ type: AdministrativeContact })
  async createAdministrativeContact(
    @Param('id') id: string,
    @Body() administrativeContact: CreateContactDto,
  ): Promise<AdministrativeContact> {
    return await this.documentProviderService.createAdministrativeContact(
      id,
      administrativeContact,
    )
  }

  @Put(':id/administrativecontact/:administrativeContactId')
  @ApiOkResponse({ type: AdministrativeContact })
  async updateAdministrativeContact(
    @Param('id') id: string,
    @Param('administrativeContactId') administrativeContactId: string,
    @Body() administrativeContact: UpdateContactDto,
  ): Promise<AdministrativeContact> {
    const {
      numberOfAffectedRows,
      updatedContact,
    } = await this.documentProviderService.updateAdministrativeContact(
      administrativeContactId,
      administrativeContact,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `AdministrativeContact ${administrativeContactId} does not exist.`,
      )
    }

    return updatedContact
  }

  @Post(':id/technicalcontact')
  @ApiOkResponse({ type: TechnicalContact })
  async createTechnicalContact(
    @Param('id') id: string,
    @Body() technicalContact: CreateContactDto,
  ): Promise<TechnicalContact> {
    return await this.documentProviderService.createTechnicalContact(
      id,
      technicalContact,
    )
  }

  @Put(':id/technicalcontact/:technicalContactId')
  @ApiOkResponse({ type: TechnicalContact })
  async updateTechnicalContact(
    @Param('id') id: string,
    @Param('technicalContactId') technicalContactId: string,
    @Body() technicalContact: UpdateContactDto,
  ): Promise<TechnicalContact> {
    const {
      numberOfAffectedRows,
      updatedContact,
    } = await this.documentProviderService.updateTechnicalContact(
      technicalContactId,
      technicalContact,
    )

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(
        `TechnicalContact ${technicalContactId} does not exist.`,
      )
    }

    return updatedContact
  }

  @Post(':id/helpdesk')
  @ApiOkResponse({ type: Helpdesk })
  async createHelpdesk(
    @Param('id') id: string,
    @Body() helpdesk: CreateHelpdeskDto,
  ): Promise<Helpdesk> {
    return await this.documentProviderService.createHelpdesk(id, helpdesk)
  }

  @Put(':id/helpdesk/:helpdeskId')
  @ApiOkResponse({ type: Helpdesk })
  async updateHelpdesk(
    @Param('id') id: string,
    @Param('helpdeskId') helpdeskId: string,
    @Body() helpdesk: UpdateHelpdeskDto,
  ): Promise<Helpdesk> {
    const {
      numberOfAffectedRows,
      updatedHelpdesk,
    } = await this.documentProviderService.updateHelpdesk(helpdeskId, helpdesk)

    if (numberOfAffectedRows === 0) {
      throw new NotFoundException(`Helpdesk ${helpdeskId} does not exist.`)
    }

    return updatedHelpdesk
  }
}
