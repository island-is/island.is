import {
  buildCheckboxField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildMultiField,
  buildSection,
  buildSelectField,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { otherInformationMessages } from '../../lib/messages'
import { getApplicationAnswers } from '../../utils/getApplicationAnswers'
import {
  getLanguageOptions,
  getLocationOptions,
  getSelectedChild,
  getSpeechPathologistOptions,
} from '../../utils/speechTherapyWaitingListRegistrationUtils'

export const otherInformationSection = buildSection({
  id: 'otherInformationSection',
  title: otherInformationMessages.sectionTitle,
  condition: (answers) =>
    getApplicationAnswers(answers).waitingListConsent === YES,
  children: [
    buildMultiField({
      id: 'otherInformation',
      title: otherInformationMessages.sectionTitle,
      description: otherInformationMessages.description,
      children: [
        buildDescriptionField({
          id: 'otherInformation.languages.title',
          title: otherInformationMessages.language,
          description: otherInformationMessages.languageDescription,
          titleVariant: 'h4',
        }),
        buildFieldsRepeaterField({
          id: 'otherInformation.languages',
          formTitleNumbering: 'none',
          addItemButtonText: otherInformationMessages.addLanguage,
          removeItemButtonText: otherInformationMessages.removeLanguage,
          marginTop: 0,
          fields: {
            language: {
              component: 'select',
              label: (index) => ({
                ...otherInformationMessages.languageSelectionTitle,
                values: { index: index + 1 },
              }),
              placeholder: otherInformationMessages.languagePlaceholder,
              width: 'full',
              options: (application) =>
                getLanguageOptions(application.externalData),
              filterOptions: (options, answers, index) => {
                const { languages } = getApplicationAnswers(answers)

                const selectedLanguages = languages
                  .filter((_, idx) => idx !== index)
                  .map(({ language }) => language)

                return options.filter(
                  ({ value }) => !selectedLanguages.includes(value),
                )
              },
            },
          },
        }),

        buildDescriptionField({
          id: 'otherInformation.locations.title',
          title: otherInformationMessages.location,
          description: otherInformationMessages.locationDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildTextField({
          id: 'otherInformation.municipality',
          title: otherInformationMessages.municipality,
          disabled: true,
          defaultValue: (application: Application) =>
            getSelectedChild(application.answers, application.externalData)
              ?.address?.locality,
        }),
        buildFieldsRepeaterField({
          id: 'otherInformation.locations',
          formTitleNumbering: 'none',
          addItemButtonText: otherInformationMessages.addLocation,
          removeItemButtonText: otherInformationMessages.removeLocation,
          marginTop: 0,
          fields: {
            location: {
              component: 'select',
              label: (index) => ({
                ...otherInformationMessages.locationSelectionTitle,
                values: { index: index + 1 },
              }),
              placeholder: otherInformationMessages.locationPlaceholder,
              width: 'full',
              options: (application) =>
                getLocationOptions(application.externalData),
              filterOptions: (options, answers, index) => {
                const { locations } = getApplicationAnswers(answers)

                const selectedLocations = locations
                  .filter((_, idx) => idx !== index)
                  .map(({ location }) => location)

                return options.filter(
                  ({ value }) => !selectedLocations.includes(value),
                )
              },
            },
          },
        }),

        buildDescriptionField({
          id: 'otherInformation.chosenSpeechPathologist.title',
          title: otherInformationMessages.speechTherapist,
          description: otherInformationMessages.speechTherapistDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildSelectField({
          id: 'otherInformation.chosenSpeechPathologist',
          title: otherInformationMessages.speechTherapistSelectionTitle,
          placeholder: otherInformationMessages.speechTherapistPlaceholder,
          options: (application) =>
            getSpeechPathologistOptions(application.externalData),
          isClearable: true,
        }),
        buildCheckboxField({
          id: 'otherInformation.speechTherapistConfirmation',
          spacing: 0,
          options: [
            {
              value: YES,
              label: otherInformationMessages.speechTherapistConfirmation,
            },
          ],
          condition: (answers) =>
            !!getApplicationAnswers(answers).chosenSpeechPathologist,
        }),

        buildDescriptionField({
          id: 'otherInformation.remoteTherapy.title',
          title: otherInformationMessages.remoteTherapy,
          description: otherInformationMessages.remoteTherapyDescription,
          titleVariant: 'h4',
          space: 4,
        }),
        buildCheckboxField({
          id: 'otherInformation.remoteTherapy',
          spacing: 0,
          options: [
            {
              value: YES,
              label: otherInformationMessages.remoteTherapyConfirmation,
            },
          ],
        }),
      ],
    }),
  ],
})
