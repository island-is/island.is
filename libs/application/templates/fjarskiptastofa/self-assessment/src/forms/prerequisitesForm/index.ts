import {
  buildAlertMessageField,
  buildCheckboxField,
  buildDescriptionField,
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTitleField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { CoFundedByEU } from '../../assets/CoFundedByEU'
import { m } from '../../lib/messages'
import { IS_REGULATED_EXTERNAL_DATA_ID } from '../../utils/constants'

// Intro ("Inngangur") screen. Built from declarative fields so the EU emblem,
// the blue sub-headings and the confirmation checkbox all live on one screen.
// The company data (identity + user profile) is fetched when entering the draft
// state, so this screen only has to inform the applicant and collect consent.
export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      tabTitle: m.prerequisites.tabTitle,
      children: [
        buildMultiField({
          id: 'intro',
          title: m.prerequisites.title,
          children: [
            // Shows the "not eligible" error when the company is not a
            // supervised entity with an open access window. The company cannot
            // continue either way: the prerequisites -> draft transition is
            // guarded by the same check on the backend (canStartApplication).
            buildAlertMessageField({
              id: 'eligibilityError',
              alertType: 'error',
              title: m.notEligible.title,
              message: m.notEligible.description,
              condition: (_answers, externalData) => {
                const isSupervisedEntity = getValueViaPath<boolean>(
                  externalData,
                  `${IS_REGULATED_EXTERNAL_DATA_ID}.data.isSupervisedEntity`,
                )
                const accessWindowOpen = getValueViaPath<boolean>(
                  externalData,
                  `${IS_REGULATED_EXTERNAL_DATA_ID}.data.accessWindowOpen`,
                )
                return !(
                  isSupervisedEntity === true && accessWindowOpen === true
                )
              },
            }),
            buildDescriptionField({
              id: 'introText',
              description: m.prerequisites.intro,
            }),
            buildImageField({
              id: 'euLogo',
              image: CoFundedByEU,
              alt: 'Co-funded by the European Union',
              imageWidth: 'auto',
              imagePosition: 'left',
              marginTop: 2,
            }),
            buildTitleField({
              title: m.prerequisites.accessTitle,
              titleVariant: 'h5',
              color: 'blue400',
              marginBottom: 0,
            }),
            buildDescriptionField({
              id: 'accessText',
              description: m.prerequisites.accessBody,
              space: 0,
            }),
            buildTitleField({
              title: m.prerequisites.confidentialityTitle,
              titleVariant: 'h5',
              color: 'blue400',
              marginBottom: 0,
            }),
            buildDescriptionField({
              id: 'confidentialityText',
              description: m.prerequisites.confidentialityBody,
              space: 0,
            }),
            buildTitleField({
              title: m.prerequisites.timeLimitTitle,
              titleVariant: 'h5',
              color: 'blue400',
              marginBottom: 0,
            }),
            buildDescriptionField({
              id: 'timeLimitText',
              description: m.prerequisites.timeLimitBody,
              space: 0,
            }),
            buildTitleField({
              title: m.prerequisites.resultsTitle,
              titleVariant: 'h5',
              color: 'blue400',
            }),
            buildDescriptionField({
              id: 'resultsText',
              description: m.prerequisites.resultsBody,
              space: 0,
              marginBottom: 4,
            }),
            buildCheckboxField({
              id: 'approveExternalData',
              required: true,
              options: [
                {
                  value: 'confirm',
                  label: m.prerequisites.checkboxLabel,
                },
              ],
            }),

            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.prerequisites.submit,
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
