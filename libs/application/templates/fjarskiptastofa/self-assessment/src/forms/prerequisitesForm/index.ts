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
} from '@island.is/application/core'
import {
  ApplicationConfigurations,
  ApplicationTypes,
  DefaultEvents,
  FormModes,
} from '@island.is/application/types'
import { ProjectBasePath } from '@island.is/shared/constants'
import { FjarskiptastofaLogo } from '@island.is/application/assets/institution-logos'
import { CoFundedByEU } from '../../assets/CoFundedByEU'
import { m } from '../../lib/messages'
import { getEligibilityState } from '../../utils/eligibility'

// Intro ("Inngangur") screen. Built from declarative fields so the EU emblem,
// the blue sub-headings and the confirmation checkbox all live on one screen.
// The company data (identity + user profile) is fetched when entering the draft
// state, so this screen only has to inform the applicant and collect consent.
export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  logo: FjarskiptastofaLogo,
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
            // Shows the "not eligible" error when Fjarskiptastofa answered and
            // reported that the company is not a supervised entity, or that its
            // access window is closed. The company cannot continue either way:
            // the prerequisites -> draft transition is guarded by the same check
            // on the backend (canStartApplication).
            buildAlertMessageField({
              id: 'eligibilityError',
              alertType: 'error',
              title: m.notEligible.title,
              message: m.notEligible.description,
              condition: (_answers, externalData) =>
                getEligibilityState(externalData) === 'notEligible',
            }),
            // A failed lookup is a separate message: we do not know whether the
            // company is eligible, so telling it that it is not would be wrong.
            //
            // The link matters. getIsRegulated only runs as onEntry when the
            // application is created, so reloading this page just shows the
            // same stored failure and there is nothing to retry. Prerequisites
            // applications are unlisted (EphemeralStateLifeCycle), so the entry
            // page finds no application to resume, creates a fresh one and runs
            // the lookup again. That is the only way back from a failure here.
            buildAlertMessageField({
              id: 'eligibilityLookupError',
              alertType: 'error',
              title: m.eligibilityLookup.errorTitle,
              message: m.eligibilityLookup.errorDescription,
              links: [
                {
                  title: m.eligibilityLookup.startOver,
                  url: `${ProjectBasePath.ApplicationSystem}/${
                    ApplicationConfigurations[
                      ApplicationTypes.FJARSKIPTASTOFA_SELF_ASSESSMENT
                    ].slug
                  }`,
                  isExternal: false,
                },
              ],
              condition: (_answers, externalData) =>
                getEligibilityState(externalData) === 'lookupFailed',
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

            // Only rendered when the company may actually start the assessment.
            // The transition is guarded by canStartApplication, so the button
            // would otherwise be a dead control for an ineligible company or
            // after a failed lookup: clicking it did nothing and said nothing.
            // Without it the footer offers a link back to Mínar síður instead.
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              condition: (_answers, externalData) =>
                getEligibilityState(externalData) === 'eligible',
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
