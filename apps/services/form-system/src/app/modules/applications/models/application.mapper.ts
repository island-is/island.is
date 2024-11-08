import { Injectable } from '@nestjs/common'
import { Form } from '../../forms/models/form.model'
import { ApplicationDto } from './dto/application.dto'
import { Application } from './application.model'
// import { FieldSettingsMapper } from '../../fieldSettings/models/fieldSettings.mapper'
import { FieldDto } from '../../fields/models/dto/field.dto'
import { OrganizationDto } from '../../organizations/models/dto/organization.dto'
import { ScreenDto } from '../../screens/models/dto/screen.dto'
import { SectionDto } from '../../sections/models/dto/section.dto'
import { ValueDto } from '../../values/models/dto/value.dto'

@Injectable()
export class ApplicationMapper {
  // constructor(private readonly fieldSettingsMapper: FieldSettingsMapper) {}
  mapFormToApplicationDto(
    form: Form,
    application: Application,
  ): ApplicationDto {
    const applicationDto: ApplicationDto = {
      id: application.id,
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
        screens: section.screens?.map((screen) => {
          return {
            id: screen.id,
            sectionId: screen.sectionId,
            name: screen.name,
            displayOrder: screen.displayOrder,
            multiset: screen.multiset,
            callRuleset: screen.callRuleset,
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
}
