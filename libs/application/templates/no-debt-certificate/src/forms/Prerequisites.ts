import {
  buildForm,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { DebtCollectorLogo } from '@island.is/application/assets/institution-logos'
import { coreMessages } from '@island.is/application/core'
import { m } from '../lib/messages'
import { CertificateLanguage } from '../lib/constants'

export const Prerequisites: Form = buildForm({
  id: 'NoDebtCertificatePrerequisites',
  mode: FormModes.DRAFT,
  logo: DebtCollectorLogo,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'certificateLanguageSection',
      title: m.certificateLanguageSection,
      children: [
        buildMultiField({
          id: 'certificateLanguageMultiField',
          title: m.certificateLanguageTitle,
          children: [
            buildRadioField({
              id: 'certificateLanguage',
              width: 'half',
              largeButtons: true,
              backgroundColor: 'blue',
              required: true,
              options: [
                {
                  value: CertificateLanguage.IS,
                  label: m.certificateLanguageIcelandic,
                },
                {
                  value: CertificateLanguage.EN,
                  label: m.certificateLanguageEnglish,
                },
              ],
            }),
            buildSubmitField({
              id: 'certificateLanguageSubmit',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: coreMessages.buttonNext,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
