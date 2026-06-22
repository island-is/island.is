import { Inject, Injectable } from '@nestjs/common'

import {
  ApproveOptions,
  CurrentApplication,
  FAApplication,
  findFamilyStatus,
  TaxData,
} from '@island.is/application/templates/financial-aid'
import type { Auth } from '@island.is/auth-nest-tools'
import { AuthMiddleware } from '@island.is/auth-nest-tools'
import {
  ApplicationState,
  FileType,
  UserType,
} from '@island.is/financial-aid/shared/lib'
import {
  ApplicationApi,
  ApplicationModel,
  ApplicationModelEmploymentEnum,
  ApplicationModelFamilyStatusEnum,
  ApplicationModelHomeCircumstancesEnum,
  ApplicationModelStateEnum,
  MunicipalityApi,
  MunicipalityModel,
  PersonalTaxReturnApi,
} from '@island.is/clients/municipalities-financial-aid'

import {
  CreateApplicationOperationRequest,
  CreateApplicationRequest,
  ApplicationsApi as rvkApplicationsApi,
} from '@island.is/clients/rvk-financial-aid'

import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import {
  ApplicationAnswerFile,
  ApplicationTypes,
  ApplicationWithAttachments,
} from '@island.is/application/types'
import { FetchError } from '@island.is/clients/middlewares'
import { messages } from '@island.is/application/templates/financial-aid'
import { TemplateApiError } from '@island.is/nest/problem'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AidModelTypeEnum,
  AidModel,
  MunicipalityModelChildrenAidEnum,
} from '@island.is/clients/municipalities-financial-aid'
import { AttachmentS3Service } from '../../shared/services'

type Props = Omit<TemplateApiModuleActionProps, 'application'> & {
  application: FAApplication
}

@Injectable()
export class FinancialAidService extends BaseTemplateApiService {
  constructor(
    private applicationApi: ApplicationApi,
    private rvkApplicationsApi: rvkApplicationsApi,
    private municipalityApi: MunicipalityApi,
    private personalTaxReturnApi: PersonalTaxReturnApi,
    private readonly attachmentService: AttachmentS3Service,
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
  ) {
    super(ApplicationTypes.FINANCIAL_AID)
  }

  // Mock data providers for testing
  async getSpouse() {
    return null // no spouse
  }

  async childrenCustodyInformation() {
    return [] // no children
  }

  municipalityCodeCheck(municipalityCode: string | null | undefined) {
    if (
      municipalityCode &&
      (municipalityCode === '0000' || municipalityCode === '1400')
    ) {
      return true
    }
    return false
  }
  // End of mock data providers for testing

  private applicationApiWithAuth(auth: Auth) {
    return this.applicationApi.withMiddleware(new AuthMiddleware(auth))
  }

  private rvkApplicationsApiWithAuth(auth: Auth) {
    return this.rvkApplicationsApi.withMiddleware(new AuthMiddleware(auth))
  }

  private municipalityApiWithAuth(auth: Auth) {
    return this.municipalityApi.withMiddleware(new AuthMiddleware(auth))
  }

  personalTaxReturnApiWithAuth(auth: Auth) {
    return this.personalTaxReturnApi.withMiddleware(new AuthMiddleware(auth))
  }

  private handle404(error: FetchError) {
    if (error.status === 404) {
      return null
    }
    throw new TemplateApiError(
      {
        title: messages.serviceErrors.veita.title,
        summary: messages.serviceErrors.veita.summary,
      },
      500,
    )
  }

  private createMockAidModel = (
    type: AidModelTypeEnum,
    amounts: {
      ownPlace: number
      registeredRenting: number
      unregisteredRenting: number
      livesWithParents: number
      withOthers: number
      unknown: number
    },
  ): AidModel => {
    const now = new Date()
    return {
      id: `mock-aid-${type.toLowerCase()}`,
      municipalityId: '0000',
      type,
      created: now,
      modified: now,
      ...amounts,
    }
  }

  private MOCK_RVK_MUNICIPALITY: MunicipalityModel = {
    id: '0000',
    name: 'Reykjavík',
    municipalityId: '0000',
    active: true,
    homepage: 'https://reykjavik.is',
    rulesHomepage: 'https://reykjavik.is',
    email: 'borgarrettur@reykjavik.is',
    usingNav: false,
    navUrl: '',
    navUsername: '',
    navPassword: '',
    childrenAid: MunicipalityModelChildrenAidEnum.NotDefined,
    decemberCompensation: 0,
    created: new Date(),
    modified: new Date(),
    individualAidId: 'mock-individual-aid',
    cohabitationAidId: 'mock-cohabitation-aid',
    individualAid: this.createMockAidModel(AidModelTypeEnum.Individual, {
      ownPlace: 211_831,
      registeredRenting: 175_121,
      unregisteredRenting: 140_121,
      livesWithParents: 105_121,
      withOthers: 140_121,
      unknown: 140_121,
    }),
    cohabitationAid: this.createMockAidModel(AidModelTypeEnum.Cohabitation, {
      ownPlace: 317_747,
      registeredRenting: 262_682,
      unregisteredRenting: 210_182,
      livesWithParents: 157_682,
      withOthers: 210_182,
      unknown: 210_182,
    }),
  }

  private fakeApplicationResponse: ApplicationModel = {
    id: '12345678-1234-1234-1234-123456789012',
    created: new Date('2026-02-20T10:00:00Z'),
    modified: new Date('2026-02-20T10:00:00Z'),
    appliedDate: new Date('2026-02-20T10:00:00Z'),
    nationalId: '0101302989', // Example national id
    name: 'Gervimaður Færeyjar',
    phoneNumber: '5555555',
    email: 'gervimadur@island.is',
    homeCircumstances: ApplicationModelHomeCircumstancesEnum.OwnPlace,
    homeCircumstancesCustom: '',
    employment: ApplicationModelEmploymentEnum.Working,
    employmentCustom: '',
    student: false,
    studentCustom: '',
    usePersonalTaxCredit: true,
    hasIncome: false,
    bankNumber: '0000',
    ledger: '00',
    accountNumber: '000000',
    interview: false,
    formComment: 'No comments on form',
    childrenComment: '',
    spouseFormComment: '',
    state: ApplicationModelStateEnum.New,
    files: [],
    rejection: '',
    staffId: 'staff-123',
    staff: {
      id: 'staff-123',
      name: 'Starfsmaður',
      nationalId: '0101302989',
      municipalityIds: ['0000'],
      roles: ['SuperAdmin'],
      active: true,
      usePseudoName: false,
      phoneNumber: '5555555',
      created: new Date('2026-02-20T10:00:00Z'),
      modified: new Date('2026-02-20T10:00:00Z'),
      nickname: 'Staffy',
      email: 'staff@island.is',
    },
    familyStatus: ApplicationModelFamilyStatusEnum.Cohabitation,
    spouseName: 'Gervikona',
    spouseNationalId: '0101302989',
    spousePhoneNumber: '',
    spouseEmail: '',
    applicationEvents: [],
    children: [],
    amount: null,
    city: 'Reykjavík',
    streetName: 'Laugavegur 1',
    postalCode: '101',
    municipalityCode: '0000',
    directTaxPayments: [],
    applicationSystemId: 'sys-id-1234',
    hasFetchedDirectTaxPayment: true,
    spouseHasFetchedDirectTaxPayment: false,
    navSuccess: true,
  }

  async createApplication({
    application,
    auth,
  }: Props): Promise<CurrentApplication> {
    console.log('--------------------------------')
    console.log('createApplication')
    console.log('--------------------------------')
    const { id, answers, externalData } = application

    const municipalityCode =
      externalData.nationalRegistry.data.address?.municipalityCode

    if (externalData.currentApplication.data?.currentApplicationId) {
      return {
        currentApplicationId:
          externalData.currentApplication.data.currentApplicationId,
      }
    }
    const children = answers.childrenSchoolInfo
      ? answers.childrenSchoolInfo.map((child) => {
          return {
            name: child.fullName,
            nationalId: child.nationalId,
            school: child.school,
            livesWithApplicant: child.livesWithApplicant,
            livesWithBothParents: child.livesWithBothParents,
          }
        })
      : []
    const childrenRvk = answers.childrenSchoolInfo
      ? answers.childrenSchoolInfo.map((child) => {
          return {
            name: child.fullName,
            kennitala: child.nationalId,
            school: child.school,
            livesWithApplicant: child.livesWithApplicant,
            livesWithBothParents: child.livesWithBothParents,
          }
        })
      : []

    const formatFiles = (files: ApplicationAnswerFile[], type: FileType) => {
      if (!files || files.length <= 0) {
        return []
      }
      return files.map((f) => {
        return {
          name: f.name ?? '',
          key: f.key ?? '',
          size: 0,
          type: type,
        }
      })
    }

    const formatFilesRvk = async (
      files: ApplicationAnswerFile[],
      type: FileType,
    ) => {
      if (!files || files.length <= 0) {
        return []
      }
      return await Promise.all(
        files.map(async (f) => {
          return {
            name: f.name ?? '',
            key:
              (await this.attachmentService.getAttachmentUrl(
                application as unknown as ApplicationWithAttachments,
                f.key!,
                300_000,
              )) ?? '',
            size: 0,
            type: type,
          }
        }),
      )
    }

    const spouseTaxFiles = () => {
      if (
        externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn == null
      ) {
        return []
      }
      return [
        externalData?.taxDataSpouse?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn,
      ]
    }

    const applicantTaxFiles = () => {
      if (
        externalData?.taxData?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn == null
      ) {
        return []
      }
      return [
        externalData?.taxData?.data?.municipalitiesPersonalTaxReturn
          ?.personalTaxReturn,
      ]
    }

    const directTaxPayments = () => {
      if (externalData?.taxDataSpouse?.data) {
        externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.concat(
          externalData?.taxDataSpouse?.data.municipalitiesDirectTaxPayments
            ?.directTaxPayments,
        )
      }
      return externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.directTaxPayments.map(
        (d) => {
          d.userType = application.assignees.includes(auth.nationalId)
            ? UserType.SPOUSE
            : UserType.APPLICANT
          return d
        },
      )
    }

    let files: ApplicationAnswerFile[] = []

    if (this.municipalityCodeCheck(municipalityCode)) {
      console.log('--------------------------------')
      console.log('formatFilesRvk municipalityCode', municipalityCode)
      console.log('--------------------------------')
      files = (
        await formatFilesRvk(answers.rvkTaxReturnFiles, FileType.TAXRETURN)
      )
        .concat(await formatFilesRvk(answers.rvkIncomeFiles, FileType.INCOME))
        .concat(
          await formatFilesRvk(
            answers.rvkSpouseIncomeFiles,
            FileType.SPOUSEFILES,
          ),
        )
        .concat(
          await formatFilesRvk(
            answers.rvkSpouseTaxReturnFiles,
            FileType.SPOUSEFILES,
          ),
        )
        .concat(await formatFilesRvk(spouseTaxFiles(), FileType.SPOUSEFILES))
        .concat(await formatFilesRvk(applicantTaxFiles(), FileType.TAXRETURN))
        .concat(
          await formatFilesRvk(answers.childrenFiles, FileType.CHILDRENFILES),
        )
    } else {
      files = formatFiles(answers.taxReturnFiles, FileType.TAXRETURN)
        .concat(formatFiles(answers.incomeFiles, FileType.INCOME))
        .concat(formatFiles(answers.spouseIncomeFiles, FileType.SPOUSEFILES))
        .concat(formatFiles(answers.spouseTaxReturnFiles, FileType.SPOUSEFILES))
        .concat(formatFiles(spouseTaxFiles(), FileType.SPOUSEFILES))
        .concat(formatFiles(applicantTaxFiles(), FileType.TAXRETURN))
        .concat(formatFiles(answers.childrenFiles, FileType.CHILDRENFILES))
    }

    const newApplication = {
      name: externalData.nationalRegistry.data.fullName,
      nationalId: externalData.nationalRegistry.data.nationalId,
      phoneNumber: answers.contactInfo.phone,
      email: answers.contactInfo.email,
      homeCircumstances:
        answers.homeCircumstances.type || 'fakeHomeCircumstances',
      homeCircumstancesCustom:
        answers.homeCircumstances.custom || 'fakeHomeCircumstancesCustom',
      student: Boolean(answers.student.isStudent === ApproveOptions.Yes),
      studentCustom: answers.student.custom || 'fakeStudentCustom',
      hasIncome: Boolean(answers.income === ApproveOptions.Yes),
      usePersonalTaxCredit: Boolean(
        answers.personalTaxCredit === ApproveOptions.Yes,
      ),
      bankNumber: answers.bankInfo.bankNumber,
      ledger: answers.bankInfo.ledger,
      accountNumber: answers.bankInfo.accountNumber,
      employment: answers.employment.type,
      employmentCustom: answers.employment.custom || 'fakeEmploymentCustom',
      formComment: answers.formComment || 'fakeFormComment',
      state: ApplicationState.NEW,
      files: files, // attachments
      children: children,
      childrenComment: answers.childrenComment || 'fakeChildrenComment',
      spouseNationalId:
        externalData.nationalRegistrySpouse.data?.nationalId ||
        answers.relationshipStatus?.spouseNationalId ||
        'fakeSpouseNationalId',
      spouseEmail:
        answers.spouseContactInfo?.email ||
        answers.spouse?.email ||
        answers.relationshipStatus?.spouseEmail ||
        'fakeSpouseEmail',
      spousePhoneNumber:
        answers.spouseContactInfo?.phone || 'fakeSpousePhoneNumber',
      spouseName:
        externalData.nationalRegistrySpouse.data?.name ||
        answers.spouseName ||
        'fakeName',
      spouseFormComment: answers.spouseFormComment || 'fakeSpouseFormComment',
      familyStatus: findFamilyStatus(answers, externalData),
      streetName: externalData.nationalRegistry.data.address?.streetAddress,
      postalCode: externalData.nationalRegistry.data.address?.postalCode,
      city: externalData.nationalRegistry.data.address?.locality,
      municipalityCode,
      directTaxPayments: directTaxPayments(),
      hasFetchedDirectTaxPayment:
        externalData?.taxData?.data?.municipalitiesDirectTaxPayments?.success,
      spouseHasFetchedDirectTaxPayment:
        externalData?.taxDataSpouse?.data?.municipalitiesDirectTaxPayments
          ?.success,
      applicationSystemId: id,
    }

    console.log('newApplication', JSON.stringify(newApplication, null, 2))

    if (this.municipalityCodeCheck(municipalityCode)) {
      console.log('--------------------------------')
      console.log('createApplication municipalityCode', municipalityCode)
      console.log('--------------------------------')

      return await this.rvkApplicationsApiWithAuth(auth)
        .createApplication({
          createApplicationRequest: {
            name: externalData.nationalRegistry.data.fullName,
            nationalId: externalData.nationalRegistry.data.nationalId,
            phoneNumber: answers.contactInfo.phone,
            email: answers.contactInfo.email,
            homeCircumstances:
              answers.homeCircumstances.type || 'fakeHomeCircumstances',
            homeCircumstancesCustom:
              answers.homeCircumstances.custom || 'fakeHomeCircumstancesCustom',
            student: Boolean(answers.student.isStudent === ApproveOptions.Yes),
            studentCustom: answers.student.custom || 'fakeStudentCustom',
            hasIncome: Boolean(answers.income === ApproveOptions.Yes),
            usePersonalTaxCredit: Boolean(
              answers.personalTaxCredit === ApproveOptions.Yes,
            ),
            bankNumber: answers.bankInfo.bankNumber,
            ledger: answers.bankInfo.ledger,
            accountNumber: answers.bankInfo.accountNumber,
            employment: answers.employment.type,
            employmentCustom:
              answers.employment.custom || 'fakeEmploymentCustom',
            formComment: answers.formComment || 'fakeFormComment',
            state: ApplicationState.NEW,
            files: files, // attachments
            children: childrenRvk,
            childrenComment: answers.childrenComment || 'fakeChildrenComment',
            spouseNationalId:
              externalData.nationalRegistrySpouse.data?.nationalId ||
              answers.relationshipStatus?.spouseNationalId ||
              'fakeSpouseNationalId',
            spouseEmail:
              answers.spouseContactInfo?.email ||
              answers.spouse?.email ||
              answers.relationshipStatus?.spouseEmail ||
              'fakeSpouseEmail',
            spousePhoneNumber:
              answers.spouseContactInfo?.phone || 'fakeSpousePhoneNumber',
            spouseName:
              externalData.nationalRegistrySpouse.data?.name ||
              answers.spouseName ||
              'fakeName',
            spouseFormComment:
              answers.spouseFormComment || 'fakeSpouseFormComment',
            familyStatus: findFamilyStatus(answers, externalData),
            streetName:
              externalData.nationalRegistry.data.address?.streetAddress,
            postalCode: externalData.nationalRegistry.data.address?.postalCode,
            city: externalData.nationalRegistry.data.address?.locality,
            directTaxPayments: [JSON.stringify(directTaxPayments())],
            applicationSystemId: id,
          },
          xTenantIdentifier: 'reykjavik',
          xUserPermissions: 'finaid:write',
        } as CreateApplicationOperationRequest)
        .then(() => {
          return { currentApplicationId: newApplication.applicationSystemId }
        })
        .catch((e) => {
          this.logger.error('Error creating application', { error: e })
          throw new TemplateApiError(
            {
              title: messages.serviceErrors.createApplication.title,
              summary: messages.serviceErrors.createApplication.summary,
            },
            500,
          )
        })
    } else {
      return await this.applicationApiWithAuth(auth)
        .withPreMiddleware(async (context) => {
          return {
            ...context,
            url: 'https://app-veita-api-test.azurewebsites.net/applications',

            init: {
              ...context.init,
              headers: {
                ...context.init.headers,
                'X-Tenant-Identifier': 'reykjavik',
              },
            },
          }
        })
        .withPostMiddleware(async () => {
          return new Response(JSON.stringify(this.fakeApplicationResponse), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        })
        .applicationControllerCreate({
          createApplicationDto: newApplication as any,
        })
        .then((res) => {
          return { currentApplicationId: res.id }
        })
        .catch((e) => {
          this.logger.error('Error creating application', { error: e })
          throw new TemplateApiError(
            {
              title: messages.serviceErrors.createApplication.title,
              summary: messages.serviceErrors.createApplication.summary,
            },
            500,
          )
        })
    }
  }

  async currentApplication({
    auth,
  }: Props): Promise<CurrentApplication | null> {
    const currentApplicationId = await this.applicationApiWithAuth(auth)
      .applicationControllerGetCurrentApplication()
      .catch(this.handle404)
    return currentApplicationId
      ? {
          currentApplicationId: currentApplicationId,
        }
      : null
  }

  async municipality({
    auth,
    application,
  }: Props): Promise<MunicipalityModel | null> {
    console.log('--------------------------------')
    console.log('municipality')
    console.log('--------------------------------')
    const municipalityCode =
      application.externalData.nationalRegistry.data.address?.municipalityCode

    console.log('--------------------------------')
    console.log('municipalityCode', municipalityCode)
    console.log('--------------------------------')

    if (municipalityCode == null) {
      return null
    }
    if (this.municipalityCodeCheck(municipalityCode)) {
      console.log('--------------------------------')
      console.log('municipalityCodeCheck true')
      console.log('--------------------------------')
      return this.MOCK_RVK_MUNICIPALITY
    }

    try {
      const res = await this.municipalityApiWithAuth(auth)
        .municipalityControllerGetById({ id: municipalityCode })
        .catch(this.handle404)
      console.log('--------------------------------')
      console.log('municipality res', JSON.stringify(res, null, 2))
      console.log('--------------------------------')
      return res
    } catch (error) {
      console.log('--------------------------------')
      console.log('municipality error', JSON.stringify(error, null, 2))
      console.log('falling back to rvk municipality')
      console.log('--------------------------------')
      return this.MOCK_RVK_MUNICIPALITY
    }
  }

  async taxData({ auth, application }: Props): Promise<TaxData> {
    try {
      const personalTaxReturn = await this.personalTaxReturnApiWithAuth(
        auth,
      ).personalTaxReturnControllerMunicipalitiesPersonalTaxReturn({
        id: application.id,
      })
      const directTaxPayments = await this.personalTaxReturnApiWithAuth(
        auth,
      ).personalTaxReturnControllerMunicipalitiesDirectTaxPayments()

      return {
        municipalitiesPersonalTaxReturn:
          personalTaxReturn as TaxData['municipalitiesPersonalTaxReturn'],
        municipalitiesDirectTaxPayments:
          directTaxPayments as TaxData['municipalitiesDirectTaxPayments'],
      }
    } catch {
      throw new TemplateApiError(
        {
          title: messages.serviceErrors.tax.title,
          summary: messages.serviceErrors.tax.summary,
        },
        500,
      )
    }
  }

  async sendSpouseEmail({
    auth,
    application,
  }: Props): Promise<{ success: boolean }> {
    const { answers, externalData } = application
    try {
      return await this.applicationApiWithAuth(
        auth,
      ).applicationControllerSendSpouseEmail({
        spouseEmailDto: {
          name: externalData.nationalRegistry.data.fullName,
          email: answers.contactInfo.email,
          spouseName:
            externalData.nationalRegistrySpouse.data?.name ||
            answers.spouseName ||
            '',
          spouseEmail:
            answers.spouse?.email ||
            answers.relationshipStatus.spouseEmail ||
            '',
          municipalityCode:
            externalData.municipality.data?.municipalityId || '',
          created: application.created,
          applicationSystemId: application.id,
        },
      })
    } catch {
      return {
        success: false,
      }
    }
  }
}
