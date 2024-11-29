import {
  buildAlertMessageField,
  buildCustomField,
  buildDescriptionField,
  buildInformationFormField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'

import { seminar as seminarMessages } from '../../../lib/messages'
import { ExternalData, FormValue } from '@island.is/application/types'
import { isPersonType } from '../../../utils'
import { CourseDTO } from '@island.is/clients/seminars-ver'

export const seminarInformationSection = buildSection({
  id: 'seminarInformation',
  title: seminarMessages.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'seminarInformationMultiField',
      title: seminarMessages.general.pageTitle,
      description: seminarMessages.general.pageDescription,
      children: [
        buildInformationFormField({
          paddingX: 3,
          paddingY: 3,
          items: (application) => {
            const seminar = getValueViaPath<CourseDTO>(
              application.externalData,
              'seminar.data',
            )
            return [
              {
                label: seminarMessages.labels.seminarType,
                value: seminar?.name ?? '',
              },
              {
                label: seminarMessages.labels.seminarPrice,
                value: seminar?.price?.toString() ?? '', // TODO: Format price
              },
              {
                label: seminarMessages.labels.seminarBegins,
                value: 'Við skráningu',
              },
              {
                label: seminarMessages.labels.seminarEnds,
                value: 'Er opið í 8 vikur frá skráningu',
              },
              {
                label: seminarMessages.labels.seminarDescription,
                value: '', // {seminarDescriptionUrlText, url: selectedSeminar.descriptionUrl},
              },
              {
                label: seminarMessages.labels.seminarLocation,
                value: 'Fræðslukerfi Vinnueftirlitsins (á netinu)',
              },
            ]
          },
        }),
        buildAlertMessageField({
          id: 'seminarInformationAlert',
          title: '',
          message: seminarMessages.labels.alertMessage,
          alertType: 'info',
          marginTop: 4,
          condition: (answers: FormValue, externalData: ExternalData) =>
            isPersonType(externalData),
        }),
      ],
    }),
  ],
})
