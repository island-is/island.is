import { Injectable } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { ApplicationDto } from './dto/application.dto'
import { Application } from './application.model'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'
import { Dependency } from '../../../dataTypes/dependency.model'
import { ValueDto } from './dto/value.dto'
import { ListItemDto } from '../../listItems/models/dto/listItem.dto'
import { ApplicationStatus, SectionTypes } from '@island.is/form-system/shared'
import { MyPagesApplicationResponseDto } from './dto/myPagesApplication.response.dto'

@Injectable()
export class ApplicationMapper {
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
    const applicationDto: ApplicationDto = {
      id: application.id,
      isTest: application.isTest,
      dependencies: application.dependencies,
      completed: application.completed,
      status: application.status,
      formId: form.id,
      modified: application.modified,
      slug: form.slug,
      formName: form.name,
      allowProceedOnValidationFail: form.allowProceedOnValidationFail,
      hasPayment: form.hasPayment,
      hasSummaryScreen: form.hasSummaryScreen,
      submittedAt: application.submittedAt,
      events: application.events,
      sections: [],
      certificationTypes: form.formCertificationTypes,
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
              sectionId: screen.sectionId,
              name: screen.name,
              displayOrder: screen.displayOrder,
              multiset: screen.multiset,
              callRuleset: screen.callRuleset,
              isHidden: this.isHidden(screen.id, application.dependencies),
              isCompleted: this.isCompleted(screen.id, application.completed),
              fields: screen.fields?.map((field) => {
                return {
                  id: field.id,
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
          isFileEvent: event.isFileEvent,
        }
      }),
      files: application.files?.map((file) => {
        return {
          id: file.id,
          order: file.order,
          json: file.json,
          events: file.events?.map((event) => {
            return {
              created: event.created,
              eventType: event.eventType,
              isFileEvent: event.isFileEvent,
            }
          }),
        } as ValueDto
      }),
    }
    return applicationMinimalDto
  }

  private isHidden(
    id: string,
    dependencies: Dependency[] | undefined,
  ): boolean {
    if (!dependencies) {
      return false
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
  ): Promise<MyPagesApplicationResponseDto[]> {
    if (!applications?.length) {
      return []
    }

    const mapped: MyPagesApplicationResponseDto[] = applications.flatMap(
      (app) => {
        if (app.status === ApplicationStatus.DRAFT) return [this.draft(app)]
        if (app.status === ApplicationStatus.COMPLETED)
          return [this.completed(app)]
        return [] // flatMap removes these automatically
      },
    )

    // Sort newest first (optional)
    mapped.sort(
      (a, b) =>
        new Date(b.modified as any).getTime() -
        new Date(a.modified as any).getTime(),
    )

    return mapped
  }

  private draft(app: Application): MyPagesApplicationResponseDto {
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
        history: [],
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
        historyButton: 'historyButton',
      },
      attachments: {},
      typeId: 'ExampleCommonActions', // TODO: What to put here?
      answers: { approveExternalData: true },
      externalData: {},
      name: app.formName,
      status: app.status,
      pruned: false,
      formSystemFormSlug: app.formSlug,
      formSystemOrgContentfulId: app.orgContentfulId,
      formSystemOrgSlug: app.orgSlug,
    } as MyPagesApplicationResponseDto
  }

  private completed(app: Application): MyPagesApplicationResponseDto {
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
          displayStatus: 'success',
          title: app.completedMessage,
        },
        history: [],
        draftFinishedSteps: app.draftFinishedSteps ?? 0,
        draftTotalSteps: app.draftTotalSteps ?? 0,
        historyButton: 'historyButton',
      },
      attachments: {},
      typeId: 'ExampleCommonActions', // TODO: What to put here?
      answers: { approveExternalData: true },
      externalData: {},
      name: app.formName,
      status: app.status,
      pruned: false,
      formSystemFormSlug: app.formSlug,
      formSystemOrgContentfulId: app.orgContentfulId,
      formSystemOrgSlug: app.orgSlug,
    }
  }
}
