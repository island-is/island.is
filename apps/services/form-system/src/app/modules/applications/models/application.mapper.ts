import { Injectable } from '@nestjs/common'
import { Dependency } from '../../../dataTypes/dependency.model'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { Form } from '../../forms/models/form.model'
import { ListItemDto } from '../../listItems/models/dto/listItem.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'
import { Application } from './application.model'
import { ApplicationDto } from './dto/application.dto'
import { ValueDto } from './dto/value.dto'
import { ApplicationStatus, SectionTypes } from '@island.is/form-system/shared'
import { MyPagesApplicationResponseDto } from './dto/myPagesApplication.response.dto'
import { Field } from '../../fields/models/field.model'
import type { Locale } from '@island.is/shared/types'

@Injectable()
export class ApplicationMapper {
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
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
      usePopulate: form.usePopulate,
      submissionServiceUrl: form.submissionServiceUrl,
      allowProceedOnValidationFail: form.allowProceedOnValidationFail,
      hasPayment: form.hasPayment,
      hasSummaryScreen: form.hasSummaryScreen,
      submittedAt: application.submittedAt,
      events: application.events,
      sections: [],
      certificationTypes: form.formCertificationTypes,
      completedSectionInfo: form.completedSectionInfo,
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
              multiset: screen.multiset,
              shouldValidate: form.useValidate && screen.shouldValidate,
              shouldPopulate: form.usePopulate && screen.shouldPopulate,
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
        deleteButton: false,
        pendingAction: {
          displayStatus: 'displayStatus',
          title: 'title',
          content: 'content',
          button: 'button',
        },
        history:
          app.events?.map((event) => {
            return {
              date: event.created,
              log: event.eventMessage[locale],
            }
          }) || [],
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
      },
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
        history:
          app.events?.map((event) => {
            return {
              date: event.created,
              log: event.eventMessage[locale],
            }
          }) || [],
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
      },
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
    }
  }
}
