import {
  buildAsyncSelectField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildRadioField,
  buildSubSection,
  buildTextField,
  coreErrorMessages,
  NO,
  YES,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { newPrimarySchoolMessages } from '../../../lib/messages'
import { CaseWorkerInputTypeEnum } from '../../../utils/constants'
import {
  getApplicationAnswers,
  getApplicationExternalData,
  getDefaultSupportCaseworker,
  getDefaultYESNOValue,
  hasDefaultSupportCaseworker,
} from '../../../utils/newPrimarySchoolUtils'

export const supportSpecialSchoolDisabilitySubSection = buildSubSection({
  id: 'supportSpecialSchoolDisabilitySubSection',
  title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
  condition: (_) => {
    return false //TODO: change to isSerdeild
  },
  children: [
    buildMultiField({
      id: 'support',
      title: newPrimarySchoolMessages.differentNeeds.supportSubSectionTitle,
      children: [
        buildRadioField({
          id: 'support.hasBeenTreatedBySpecialist',
          title:
            newPrimarySchoolMessages.differentNeeds.hasBeenTreatedBySpecialist,
          width: 'half',
          required: true,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-been-treated-by-specialist',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-been-treated-by-specialist',
              value: NO,
            },
          ],
        }),
        buildDescriptionField({
          id: 'support.specialist.title',
          title: newPrimarySchoolMessages.differentNeeds.specialistTitle,
          titleVariant: 'h4',
          space: 4,
          condition: (answers) => {
            const { hasBeenTreatedBySpecialist } =
              getApplicationAnswers(answers)
            return hasBeenTreatedBySpecialist === YES
          },
        }),
        buildAsyncSelectField({
          id: 'support.specialist',
          title: newPrimarySchoolMessages.differentNeeds.specialist,
          placeholder:
            newPrimarySchoolMessages.differentNeeds.specialistPlaceholder,
          loadingError: coreErrorMessages.failedDataProvider,
          dataTestId: 'support-specialist',
          loadOptions: async ({ apolloClient }) => {
            // const { data } = await apolloClient.query<Query>({
            //   query: friggOrganizationsByTypeQuery,
            // })

            return []
          },
          condition: (answers) => {
            const { hasBeenTreatedBySpecialist } =
              getApplicationAnswers(answers)
            return hasBeenTreatedBySpecialist === YES
          },
        }),
        buildRadioField({
          id: 'support.hasIntegratedServices',
          title: newPrimarySchoolMessages.differentNeeds.hasIntegratedServices,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-integrated-services',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-integrated-services',
              value: NO,
            },
          ],
          defaultValue: (application: Application) => {
            const { socialProfile } = getApplicationExternalData(
              application.externalData,
            )

            return getDefaultYESNOValue(socialProfile?.hasIntegratedServices)
          },
        }),
        buildRadioField({
          id: 'support.hasCaseManager',
          title: newPrimarySchoolMessages.differentNeeds.hasCaseManager,
          width: 'half',
          required: true,
          space: 4,
          options: [
            {
              label: newPrimarySchoolMessages.shared.yes,
              dataTestId: 'has-case-manager',
              value: YES,
            },
            {
              label: newPrimarySchoolMessages.shared.no,
              dataTestId: 'no-has-case-manager',
              value: NO,
            },
          ],
          defaultValue: (application: Application) =>
            hasDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            ),
        }),
        buildTextField({
          id: 'support.caseManager.name',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerName,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { hasCaseManager } = getApplicationAnswers(answers)
            return hasCaseManager === YES
          },
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.name || '',
        }),
        buildTextField({
          id: 'support.caseManager.email',
          title: newPrimarySchoolMessages.differentNeeds.caseManagerEmail,
          width: 'half',
          required: true,
          condition: (answers) => {
            const { hasCaseManager } = getApplicationAnswers(answers)
            return hasCaseManager === YES
          },
          defaultValue: (application: Application) =>
            getDefaultSupportCaseworker(
              application.externalData,
              CaseWorkerInputTypeEnum.CaseManager,
            )?.email || '',
        }),
        buildHiddenInput({
          id: 'support.triggerHiddenInput',
          doesNotRequireAnswer: true,
        }),
      ],
    }),
  ],
})
