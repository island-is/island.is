import { Injectable } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { Application } from './application.model'
import { ListItem } from '../../listItems/models/listItem.model'
import {
  ApplicationDto,
  FieldDto,
  ListItemDto,
  ScreenDto,
  SectionDto,
  ValueDto,
} from '@island.is/form-system-dto'
import { Dependency } from '@island.is/form-system-dataTypes'

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
      slug: form.slug,
      formName: form.name,
      submittedAt: application.submittedAt,
      events: application.events,
      sections: [],
      certificationTypes: form.formCertificationTypes,
      applicantTypes: form.formApplicantTypes,
    }

    form.sections?.map((section) => {
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

    let isDependant = false

    for (let i = 0; i < dependencies.length; i++) {
      if (dependencies[i].childProps.includes(id)) {
        isDependant = true
        break
      }
    }

    if (!isDependant) {
      return false
    }

    let isHidden = true

    for (let i = 0; i < dependencies.length; i++) {
      if (
        dependencies[i].childProps.includes(id) &&
        dependencies[i].isSelected === true
      ) {
        isHidden = false
        break
      }
    }

    return isHidden
  }

  private isCompleted(id: string, completed: string[] | undefined) {
    if (!completed) {
      return false
    }

    return completed?.includes(id)
  }
}
