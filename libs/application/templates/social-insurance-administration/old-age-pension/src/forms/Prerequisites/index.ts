import { SocialInsuranceAdministrationLogo } from '@island.is/application/assets/institution-logos'
import {
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { socialInsuranceAdministrationMessage } from '@island.is/application/templates/social-insurance-administration-core/lib/messages'
import { Form, FormModes } from '@island.is/application/types'
import { oldAgePensionFormMessage } from '../../lib/messages'
import {
  getApplicationExternalData,
  getEligibleDesc,
  getEligibleLabel,
} from '../../utils/oldAgePensionUtils'
import { applicationTypeSubSection } from './applicationTypeSubSection'
import { externalDataSubSection } from './externalDataSubSection'
import { questionsSubSection } from './questionsSubSection'

export const PrerequisitesForm: Form = buildForm({
  id: 'OldAgePensionPrerequisites',
  title: socialInsuranceAdministrationMessage.shared.formTitle,
  logo: SocialInsuranceAdministrationLogo,
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: false,
  renderLastScreenBackButton: false,
  children: [
    buildSection({
      id: 'prerequisites',
      title: oldAgePensionFormMessage.pre.prerequisitesSection,
      children: [
        applicationTypeSubSection,
        externalDataSubSection,
        questionsSubSection,
        buildMultiField({
          id: 'isNotEligible',
          title: getEligibleLabel,
          condition: (_, externalData) => {
            const { isEligible } = getApplicationExternalData(externalData)
            // Show if applicant is not eligible
            return !isEligible
          },
          children: [
            buildDescriptionField({
              id: 'isNotEligible',
              description: getEligibleDesc,
            }),
          ],
        }),
      ],
    }),
  ],
})
