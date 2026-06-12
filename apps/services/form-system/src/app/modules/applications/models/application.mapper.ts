import {
  ApplicationEvents,
  ApplicationStatus,
  FieldTypesEnum,
  SectionTypes,
} from '@island.is/form-system/shared'
import type { Locale } from '@island.is/shared/types'
import { Injectable } from '@nestjs/common'
import { Dependency } from '../../../dataTypes/dependency.model'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { Field } from '../../fields/models/field.model'
import { Form } from '../../forms/models/form.model'
import { ListItemDto } from '../../listItems/models/dto/listItem.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'
import { Application } from './application.model'
import { ApplicationAdminDto } from './dto/admin/applicationAdmin.dto'
import { ApplicationDto } from './dto/application.dto'
import {
  ApplicationJsonDto,
  ApplicationJsonFieldDto,
  ApplicationJsonFieldSettingsDto,
  ApplicationJsonValueDto,
} from './dto/application.json.dto'
import { MyPagesApplicationResponseDto } from './dto/myPagesApplication.response.dto'
import { ValueDto } from './dto/value.dto'
import { SectionInfo } from '../../../../app/dataTypes/sectionInfo.model'

@Injectable()
export class ApplicationMapper {
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
    const normalizedSectionInfo: SectionInfo = {
      title: form.sectionInfo?.title ?? { is: '', en: '' },
      confirmationHeader: form.sectionInfo?.confirmationHeader ?? {
        is: '',
        en: '',
      },
      confirmationText: form.sectionInfo?.confirmationText ?? {
        is: '',
        en: '',
      },
      additionalInfo: form.sectionInfo?.additionalInfo ?? [],
      additionalPremises: form.sectionInfo?.additionalPremises ?? [],
    }

    const applicationDto: ApplicationDto = {
      id: application.id,
      nationalId: application.nationalId,
      isTest: application.isTest,
      dependencies: application.dependencies,
      completed: application.completed,
      status: application.status,
      formId: form.id,
      modified: application.modified,
      slug: form.slug,
      formName: form.name,
      draftFinishedSteps: application.draftFinishedSteps,
      draftTotalSteps: application.draftTotalSteps,
      zendeskInternal: form.zendeskInternal,
      useValidate: form.useValidate,
      submissionServiceUrl: form.submissionServiceUrl,
      allowProceedOnValidationFail: form.allowProceedOnValidationFail,
      hasPayment: form.hasPayment,
      hasSummaryScreen: form.hasSummaryScreen,
      submittedAt: application.submittedAt,
      events: application.events,
      sections: [],
      certificationTypes: form.formCertificationTypes,
      sectionInfo: normalizedSectionInfo,
      organizationNationalId: form.organizationNationalId,
    }

    form.sections
      ?.filter((section) => {
        if (
          !form.hasSummaryScreen &&
          section.sectionType === SectionTypes.SUMMARY
        ) {
          return false
        }
        if (!form.hasPayment && section.sectionType === SectionTypes.PAYMENT) {
          return false
        }
        return true
      })
      .map((section) => {
        applicationDto.sections?.push({
          id: section.id,
          name: section.name,
          sectionType: section.sectionType,
          displayOrder: section.displayOrder,
          waitingText: section.waitingText,
          isHidden: this.isHidden(section.id, application.dependencies),
          isCompleted: this.isCompleted(section.id, application.completed),
          screens: section.screens?.map((screen) => {
            return {
              id: screen.id,
              identifier: screen.identifier,
              sectionId: screen.sectionId,
              name: screen.name,
              displayOrder: screen.displayOrder,
              multiMax: screen.multiMax,
              isMulti: screen.isMulti,
              shouldValidate: form.useValidate && screen.shouldValidate,
              screenError: {
                hasError: false,
                title: { is: '', en: '' },
                message: { is: '', en: '' },
              },
              isHidden: this.isHidden(
                screen.id,
                application.dependencies,
                section.sectionType,
                screen.fields,
              ),
              isCompleted: this.isCompleted(screen.id, application.completed),
              fields: screen.fields?.map((field) => {
                return {
                  id: field.id,
                  identifier: field.identifier,
                  screenId: field.screenId,
                  name: field.name,
                  displayOrder: field.displayOrder,
                  description: field.description,
                  isPartOfMultiset: field.isPartOfMultiset,
                  fieldType: field.fieldType,
                  isRequired: field.isRequired,
                  fieldSettings: field.fieldSettings,
                  isHidden: this.isHidden(field.id, application.dependencies),
                  list: field.list?.map((list) => {
                    return {
                      id: list.id,
                      label: list.label,
                      description: list.description,
                      displayOrder: list.displayOrder,
                      value: list.value,
                      isSelected: list.isSelected,
                    } as ListItemDto
                  }),
                  values: field.values?.map((value) => {
                    return {
                      id: value.id,
                      order: value.order,
                      json: value.json,
                    } as ValueDto
                  }),
                } as FieldDto
              }),
            } as ScreenDto
          }),
        } as SectionDto)
      })
    return applicationDto
  }

  mapApplicationToApplicationMinimalDto(
    application: Application,
    form: Form | null,
  ): ApplicationDto {
    const applicationMinimalDto: ApplicationDto = {
      id: application.id,
      isTest: application.isTest,
      dependencies: application.dependencies,
      completed: application.completed,
      status: application.status,
      formId: form?.id,
      slug: form?.slug,
      formName: form?.name,
      allowProceedOnValidationFail: form?.allowProceedOnValidationFail,
      hasPayment: form?.hasPayment,
      hasSummaryScreen: form?.hasSummaryScreen,
      submittedAt: application.submittedAt,
      events: application.events?.map((event) => {
        return {
          created: event.created,
          eventType: event.eventType,
        }
      }),
      files: application.files?.map((file) => {
        return {
          id: file.id,
          order: file.order,
          json: file.json,
        } as ValueDto
      }),
    }
    return applicationMinimalDto
  }

  mapApplicationDtoToApplicationJsonDto(
    applicationDto: ApplicationDto,
  ): ApplicationJsonDto {
    const fields: ApplicationJsonFieldDto[] = (applicationDto.sections ?? [])
      .flatMap((section) => section.screens ?? [])
      .flatMap((screen) =>
        (screen.fields ?? []).map((field) => ({
          field,
          screenIdentifier: screen.identifier,
          screenTitle: screen.name,
        })),
      )
      .filter(({ field }) => !field.isHidden)
      .filter(({ field }) => field.fieldType !== FieldTypesEnum.MESSAGE)
      .filter(({ field }) => (field.values?.length ?? 0) > 0)
      .map(({ field, screenIdentifier, screenTitle }) => {
        const jsonField = new ApplicationJsonFieldDto()
        jsonField.identifier = field.identifier
        jsonField.screenIdentifier = screenIdentifier
        jsonField.screenTitle = screenTitle
        jsonField.fieldTitle = field.name
        jsonField.fieldType = field.fieldType

        const settings = new ApplicationJsonFieldSettingsDto()
        if (field.fieldType === FieldTypesEnum.NUMBERBOX) {
          settings.isDecimal = field.fieldSettings?.isDecimal ?? false
        }
        if (field.fieldType === FieldTypesEnum.APPLICANT) {
          settings.applicantType = field.fieldSettings?.applicantType
        }
        if (
          settings.isDecimal !== undefined ||
          settings.applicantType !== undefined
        ) {
          jsonField.fieldSettings = settings
        }

        jsonField.values = (field.values ?? []).map((value) => {
          const jsonValue = new ApplicationJsonValueDto()
          jsonValue.order = value.order
          jsonValue.json = value.json ?? {}
          return jsonValue
        })
        return jsonField
      })

    const jsonDto = new ApplicationJsonDto()
    jsonDto.id = applicationDto.id ?? ''
    jsonDto.organizationNationalId = applicationDto.organizationNationalId ?? ''
    jsonDto.slug = applicationDto.slug ?? ''
    jsonDto.isTest = applicationDto.isTest ?? false
    jsonDto.status = applicationDto.status ?? ''
    jsonDto.submittedAt = applicationDto.submittedAt ?? null
    jsonDto.fields = fields

    return jsonDto
  }

  private isHidden(
    id: string,
    dependencies: Dependency[] | undefined,
    sectionType?: string,
    fields?: Field[],
  ): boolean {
    if (!dependencies) {
      return false
    }

    if (sectionType === SectionTypes.PARTIES && fields && !fields[0]?.values) {
      return true
    }

    const childProps = dependencies.flatMap(
      (dependency) => dependency?.childProps,
    )

    if (!childProps.includes(id)) {
      return false
    }

    const dependencyItems = dependencies.filter((dependency) =>
      dependency.childProps.includes(id),
    )

    const isHidden = dependencyItems.every(
      (dependency) => dependency.isSelected === false,
    )

    return isHidden
  }

  private isCompleted(id: string, completed: string[] | undefined) {
    if (!completed) {
      return false
    }

    return completed?.includes(id)
  }

  async mapApplicationsToMyPagesApplications(
    applications: Application[],
    locale: Locale,
  ): Promise<MyPagesApplicationResponseDto[]> {
    if (!applications?.length) {
      return []
    }

    const mapped: MyPagesApplicationResponseDto[] = applications.flatMap(
      (app) => {
        if (app.status === ApplicationStatus.DRAFT)
          return [this.draft(app, locale)]
        if (app.status === ApplicationStatus.COMPLETED)
          return [this.completed(app, locale)]
        return [] // flatMap removes these automatically
      },
    )

    // Sort newest first (optional)
    mapped.sort(
      (a, b) => new Date(b.modified).getTime() - new Date(a.modified).getTime(),
    )

    return mapped
  }

  private draft(
    app: Application,
    locale: Locale,
  ): MyPagesApplicationResponseDto {
    return {
      id: app.id,
      created: app.created,
      modified: app.modified,
      applicant: app.nationalId,
      assignees: [],
      applicantActors: [],
      state: app.status,
      actionCard: {
        title: app.formName,
        description: '',
        tag: {
          label: app.tagLabel,
          variant: app.tagVariant,
        },
        deleteButton: true,
        history: (app.events ?? [])
          .filter(
            (event) =>
              event.eventType !== ApplicationEvents.APPLICATION_FETCHED,
          )
          .map((event) => {
            return {
              date: event.created,
              log: event.eventMessage[locale],
            }
          }),
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
        displayPruneAt: true,
      },
      pruneAt: app.pruneAt,
      attachments: {},
      typeId: '',
      answers: { approveExternalData: true },
      externalData: {},
      name: app.formName,
      status: app.status,
      pruned: app.pruned,
      formSystemFormSlug: app.formSlug,
      formSystemOrgContentfulId: app.orgContentfulId,
      formSystemOrgSlug: app.orgSlug,
    } as MyPagesApplicationResponseDto
  }

  private completed(
    app: Application,
    locale: Locale,
  ): MyPagesApplicationResponseDto {
    return {
      id: app.id,
      created: app.created,
      modified: app.modified,
      applicant: app.nationalId,
      assignees: [],
      applicantActors: [],
      state: app.status,
      actionCard: {
        title: app.formName,
        description: '',
        tag: {
          label: app.tagLabel,
          variant: app.tagVariant,
        },
        deleteButton: false,
        history: (app.events ?? [])
          .filter(
            (event) =>
              event.eventType !== ApplicationEvents.APPLICATION_FETCHED,
          )
          .map((event) => {
            return {
              date: event.created,
              log: event.eventMessage[locale],
            }
          }),
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
        displayPruneAt: true,
      },
      pruneAt: app.pruneAt,
      attachments: {},
      typeId: '',
      answers: { approveExternalData: true },
      externalData: {},
      name: app.formName,
      status: app.status,
      pruned: app.pruned,
      formSystemFormSlug: app.formSlug,
      formSystemOrgContentfulId: app.orgContentfulId,
      formSystemOrgSlug: app.orgSlug,
    } as MyPagesApplicationResponseDto
  }

  mapApplicationToApplicationAdminDto(
    application: Application,
    locale?: Locale,
  ): ApplicationAdminDto {
    return {
      id: application.id,
      created: application.created,
      modified: application.modified,
      formId: application.formId,
      formName:
        locale === 'is'
          ? application.form?.name?.is
          : application.form?.name?.en,
      formSlug: application.form?.slug,
      applicant: application.nationalId,
      status: application.status,
      state: application.state,
      pruneAt: application.pruneAt,
      pruned: application.pruned,
      institutionNationalId: application.form?.organization?.nationalId,
    }
  }
}
