import { Injectable, PreconditionFailedException } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { ApplicationDto } from './dto/application.dto'
import { Application } from './application.model'
// import { FieldSettingsMapper } from '../../fieldSettings/models/fieldSettings.mapper'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { OrganizationDto } from '../../organizations/models/dto/organization.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'
import { ValueDto } from '../../values/models/dto/value.dto'
import { Dependency } from '../../../dataTypes/dependency.model'

@Injectable()
export class ApplicationMapper {
  // constructor(private readonly fieldSettingsMapper: FieldSettingsMapper) {}
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
    const applicationDto: ApplicationDto = {
      id: application.id,
      dependencies: application.dependencies,
      formId: form.id,
      slug: form.slug,
      formName: form.name,
      organization: new OrganizationDto(),
      sections: [],
    }

    form.sections?.map((section) => {
      applicationDto.sections?.push({
        id: section.id,
        name: section.name,
        sectionType: section.sectionType,
        displayOrder: section.displayOrder,
        waitingText: section.waitingText,
        isHidden: this.isHidden(section.id, application.dependencies),
        screens: section.screens?.map((screen) => {
          return {
            id: screen.id,
            sectionId: screen.sectionId,
            name: screen.name,
            displayOrder: screen.displayOrder,
            multiset: screen.multiset,
            callRuleset: screen.callRuleset,
            isHidden: this.isHidden(screen.id, application.dependencies),
            fields: screen.fields?.map((field) => {
              return {
                id: field.id,
                screenId: field.screenId,
                name: field.name,
                displayOrder: field.displayOrder,
                description: field.description,
                isPartOfMultiset: field.isPartOfMultiset,
                fieldType: field.fieldType,
                fieldSettings: field.fieldSettings,
                isHidden: this.isHidden(field.id, application.dependencies),
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
}
