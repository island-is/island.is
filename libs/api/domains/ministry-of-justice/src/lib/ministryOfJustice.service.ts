import type { User } from '@island.is/auth-nest-tools'
import {
  DmrClientService,
  JournalControllerAdvertsRequest,
  JournalControllerValidateRequest,
  JournalValidateSuccessResponse,
} from '@island.is/clients/dmr'
import { AdvertsResponse } from './models/responses'
import { Advert, AdvertCategory } from './models/advert.model'
import { mapAdvertDepartment, mapAdvertStatus } from './mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class MinistryOfJusticeService {
  constructor(private readonly dmrService: DmrClientService) {}

  async validateAdvert(
    auth: User,
    advert: JournalControllerValidateRequest,
  ): Promise<JournalValidateSuccessResponse> {
    console.log('from ministry of justice service:', advert)
    const results = await this.dmrService.validateAdvert(auth, advert)
    console.log(results)
    return results
  }

  async submitApplication(auth: User): Promise<JournalValidateSuccessResponse> {
    throw new Error('Method not implemented.')
  }

  async getOptions(auth: User) {
    return {
      data: {
        departments: [
          { value: '0', label: 'A-deild' },
          { value: '1', label: 'B-deild' },
          { value: '2', label: 'C-deild' },
        ],
        categories: [
          { value: '0', label: 'Gjaldskrá' },
          { value: '1', label: 'Auglýsing' },
          { value: '2', label: 'Reglugerð' },
          { value: '3', label: 'Skipulagsskrá' },
          { value: '4', label: 'Fjallskilasamþykkt' },
          { value: '5', label: 'Reglur' },
          { value: '6', label: 'Samþykkt' },
        ],
        subCategories: [
          { value: '0', label: 'Skipulagsreglugerð' },
          { value: '1', label: 'Byggingarreglugerð' },
          { value: '2', label: 'Hafnarreglugerð' },
        ],
      },
    }
  }

  async adverts(
    auth: User,
    input: JournalControllerAdvertsRequest,
  ): Promise<AdvertsResponse> {
    const adverts = await this.dmrService.adverts(auth, input)

    const mappedAdverts: Array<Advert> = adverts.map((advert) => {
      return {
        id: advert.id,
        department: mapAdvertDepartment(advert.department),
        type: advert.type,
        status: mapAdvertStatus(advert.status),
        title: advert.title,
        subject: advert.subject,
        publicationNumber: advert.publicationNumber
          ? {
              number: advert.publicationNumber.number,
              year: advert.publicationNumber.year,
              full: advert.publicationNumber.full,
            }
          : undefined,
        createdDate: advert.createdDate,
        updatedDate: advert.updatedDate,
        signatureDate: null,
        publicationDate: null,
        categories: (advert.categories as unknown as AdvertCategory[]).map(
          (category) => ({
            id: category.id,
            name: category.name,
            slug: category.slug,
          }),
        ),
        involvedParty: advert.involvedParty,
        document: {
          isLegacy: advert.document.isLegacy,
          html: null,
          pdfUrl: null,
        },
      }
    })

    console.log('mappedAdverts', mappedAdverts)

    const response: AdvertsResponse = {
      adverts: mappedAdverts,
      paging: {
        page: 0, // data.paging.page,
        totalPages: 0, // data.paging.totalPages,
        totalItems: 0, // data.paging.totalItems,
        pageSize: 0, // data.paging.pageSize,
        hasNextPage: false, // data.paging.hasNextPage,
        hasPreviousPage: false, // data.paging.hasPreviousPage,
        nextPage: 0, // data.paging.nextPage,
        previousPage: undefined,
      },
    }

    return response
  }
}
