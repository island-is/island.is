import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildSelectField,
  buildCheckboxField,
  buildRadioField,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { Application } from '@island.is/application/types'

export const ProgramSubSection = buildSubSection({
  id: Routes.PROGRAMINFORMATION,
  title: information.labels.programSelection.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PROGRAMINFORMATION,
      title: information.labels.programSelection.title,
      children: [
        buildDescriptionField({
          id: `${Routes.PROGRAMINFORMATION}.title`,
          title: information.labels.programSelection.title,
          description: information.labels.programSelection.subTitle,
          titleVariant: 'h2',
        }),
        buildDescriptionField({
          id: `${Routes.PROGRAMINFORMATION}.selectTitle`,
          title: information.labels.programSelection.selectProgramTitle,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.university`,
          title: information.labels.programSelection.selectProgramLabel,
          placeholder:
            information.labels.programSelection.selectUniversityPlaceholder,
          options: (application: Application) => {
            const universities = ['Prufa'] // TODO application.externalData.universities
            return universities.map((university) => {
              return {
                label: university,
                value: university,
              }
            })
          },
        }),
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.program`,
          title: information.labels.programSelection.selectProgramLabel,
          placeholder:
            information.labels.programSelection.selectProgramPlaceholder,
          options: (application: Application) => {
            const programs = ['prugfaa '] // TODO application.externalData.programs
            return programs.map((program) => {
              return {
                label: program,
                value: program,
              }
            })
          },
        }),
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.major`,
          title: information.labels.programSelection.selectMajorLabel,
          placeholder:
            information.labels.programSelection.selectMajorPlaceholder,
          options: (application: Application) => {
            const majors = ['major1 '] // TODO application.externalData.majors
            return majors.map((major) => {
              return {
                label: major,
                value: major,
              }
            })
          },
        }),
        buildRadioField({
          id: `${Routes.PROGRAMINFORMATION}.modeOfDelivery`,
          title:
            information.labels.programSelection.checkboxModeOfDeliveryLabel,
          options: [
            // TODO right options
            {
              label: 'Staðnám',
              value: 'OnSite',
            },
            {
              label: 'Fjarnám með staðarlotun',
              value: 'Online',
            },
          ],
        }),
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.examLocation`,
          title: information.labels.programSelection.selectExamLocationLabel,
          placeholder:
            information.labels.programSelection.selectExamLocationPlaceholder,
          condition: (application) => {
            // TODO check if answer to modeOfDelivery was online, then show
            return true
          },
          options: (application: Application) => {
            const locations = ['location1 '] // TODO application.externalData.locations
            return locations.map((location) => {
              return {
                label: location,
                value: location,
              }
            })
          },
        }),
      ],
    }),
  ],
})
