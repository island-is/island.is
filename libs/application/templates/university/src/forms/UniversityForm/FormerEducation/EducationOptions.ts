import {
  buildRadioField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { formerEducation } from '../../../lib/messages/formerEducation'
import { Routes } from '../../../lib/constants'
import { Program } from '@island.is/clients/university-gateway-api'
import { FormValue } from '@island.is/application/types'
import { ApplicationTypes } from '@island.is/university-gateway'

import { InlineResponse200Items } from '@island.is/clients/inna'

export const EducationOptionsSubSection = buildSubSection({
  id: Routes.EDUCATIONOPTIONS,
  title: formerEducation.labels.educationOptions.pageTitle,
  children: [
    buildRadioField({
      id: `${Routes.EDUCATIONOPTIONS}`,
      title: formerEducation.labels.educationOptions.pageTitle,
      description: formerEducation.labels.educationOptions.pageDescription,
      condition: (formValue: FormValue, externalData) => {
        const data = externalData.innaEducation
          .data as Array<InlineResponse200Items>
        const hasInnaData = data && data.length > 0
        return !hasInnaData
      },
      options: (application, field) => {
        const externalData = application.externalData
        const chosenProgram = getValueViaPath(
          application.answers,
          'programInformation.program',
          undefined,
        ) as string | undefined

        const programs = externalData.programs.data as Array<Program>

        const showException =
          programs.filter((x) => x.id === chosenProgram)[0].allowException ??
          false

        const showThirdLevel =
          programs.filter((x) => x.id === chosenProgram)[0]
            .allowThirdLevelQualification ?? false

        const options = [
          {
            label: formerEducation.labels.educationOptions.diplomaFinishedLabel,

            subLabel:
              formerEducation.labels.educationOptions
                .diplomaFinishedDescription,

            value: ApplicationTypes.DIPLOMA,
          },
          {
            label:
              formerEducation.labels.educationOptions.diplomaNotFinishedLabel,

            subLabel:
              formerEducation.labels.educationOptions
                .diplomaNotFinishedDescription,

            value: ApplicationTypes.NOTFINISHED,
          },
        ]

        if (showThirdLevel) {
          options.push({
            label: formerEducation.labels.educationOptions.thirdLevelLabel,

            subLabel:
              formerEducation.labels.educationOptions.thirdLevelDescription,

            value: ApplicationTypes.THIRDLEVEL,
          })
        }

        if (showException) {
          options.push({
            label: formerEducation.labels.educationOptions.exemptionLabel,

            subLabel:
              formerEducation.labels.educationOptions.exemptionDescription,

            value: ApplicationTypes.EXEMPTION,
          })
        }

        return options
      },
    }),
  ],
})
