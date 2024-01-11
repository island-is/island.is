import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  buildSelectField,
  buildRadioField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { Application, FormValue } from '@island.is/application/types'
import { UniversityExternalData } from '../../../types'
import { ProgramBase } from '@island.is/clients/university-gateway-api'

export const ProgramSubSection = buildSubSection({
  id: Routes.PROGRAMINFORMATION,
  title: information.labels.programSelection.sectionTitle,
  children: [
    buildMultiField({
      id: Routes.PROGRAMINFORMATION,
      title: information.labels.programSelection.title,
      description: information.labels.programSelection.subTitle,
      children: [
        buildDescriptionField({
          id: `${Routes.PROGRAMINFORMATION}.selectTitle`,
          title: information.labels.programSelection.selectProgramTitle,
          titleVariant: 'h5',
        }),
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.university`,
          title: information.labels.programSelection.selectUniversityLabel,
          placeholder:
            information.labels.programSelection.selectUniversityPlaceholder,
          options: (application: Application) => {
            console.log('application', application)
            const universities = application.externalData.universities
              .data as Array<UniversityExternalData>

            return universities.map((uni) => {
              return { label: uni.contentfulKey, value: uni.id }
            })
          },
        }),
        // TODO can we make this dynamic, so options change when answer to previous question changes
        buildSelectField({
          id: `${Routes.PROGRAMINFORMATION}.program`,
          title: information.labels.programSelection.selectProgramLabel,
          placeholder:
            information.labels.programSelection.selectProgramPlaceholder,
          condition: (formValue: FormValue, externalData) => {
            const universityAnswer = getValueViaPath(
              formValue,
              `${Routes.PROGRAMINFORMATION}.university`,
            )
            return !!universityAnswer
          },
          options: (application: Application) => {
            const universityAnswer = getValueViaPath(
              application.answers,
              `${Routes.PROGRAMINFORMATION}.university`,
            )
            const programs = application.externalData.programs
              .data as Array<ProgramBase>
            const filteredByAnswer = programs.filter(
              (program) => program.universityId === universityAnswer,
            )
            return filteredByAnswer.map((program) => {
              return {
                label: program.nameIs,
                value: program.id,
              }
            })
          },
        }),
        buildRadioField({
          id: `${Routes.PROGRAMINFORMATION}.modeOfDelivery`,
          space: 'gutter',
          title:
            information.labels.programSelection.checkboxModeOfDeliveryLabel,
          condition: (formValue: FormValue, externalData) => {
            const programAnswer = getValueViaPath(
              formValue,
              `${Routes.PROGRAMINFORMATION}.program`,
            )

            const programs = externalData.programs.data as Array<ProgramBase>

            const filteredByAnswer = programs.filter(
              (program) => program.id === programAnswer,
            )[0]

            return !!programAnswer && filteredByAnswer.modeOfDelivery.length > 0
          },
          // TODO can we make this dynamic, so options change when answer to previous question changes
          // TODO translate options
          options: (application: Application) => {
            const programAnswer = getValueViaPath(
              application.answers,
              `${Routes.PROGRAMINFORMATION}.program`,
            )
            const programs = application.externalData.programs
              .data as Array<ProgramBase>

            const filteredByAnswer = programs.filter(
              (program) => program.id === programAnswer,
            )[0]

            return filteredByAnswer.modeOfDelivery.map((deliveryMethod) => {
              return {
                label: deliveryMethod.modeOfDelivery,
                value: deliveryMethod.modeOfDelivery,
              }
            })
          },
        }),
        // TODO set correct locations when they are available in API
        // buildSelectField({
        //   id: `${Routes.PROGRAMINFORMATION}.examLocation`,
        //   title: information.labels.programSelection.selectExamLocationLabel,
        //   placeholder:
        //     information.labels.programSelection.selectExamLocationPlaceholder,
        //   condition: (formValue: FormValue, externalData) => {
        //     const modeOfDeliveryAnswer = getValueViaPath(
        //       formValue,
        //       `${Routes.PROGRAMINFORMATION}.modeOfDelivery`,
        //     )
        //     return (
        //       modeOfDeliveryAnswer === 'ONLINE' ||
        //       modeOfDeliveryAnswer === 'ONLINE_WITH_SESSION'
        //     )
        //   },
        //   options: (application: Application) => {
        //     const locations = ['location1 '] // TODO application.externalData.locations
        //     return locations.map((location) => {
        //       return {
        //         label: location,
        //         value: location,
        //       }
        //     })
        //   },
        // }),
      ],
    }),
  ],
})
