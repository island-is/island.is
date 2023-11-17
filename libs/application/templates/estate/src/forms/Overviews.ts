import {
  buildCheckboxField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../lib/messages'
import { commonOverviewFields } from './OverviewSections/commonFields'
import { overviewAssetsAndDebts } from './OverviewSections/assetsAndDebts'
import { overviewAttachments } from './OverviewSections/attachments'
import { overviewConfirmAction } from './OverviewSections/confirmAction'
import { EstateTypes, YES, NO } from '../lib/constants'
import { deceasedInfoFields } from './Sections/deceasedInfoFields'
import { representativeOverview } from './OverviewSections/representative'

export const overview = buildSection({
  id: 'overviewEstateDivision',
  title: m.overviewTitle,
  children: [
    /* Einkaskipti */
    buildMultiField({
      id: 'overviewPrivateDivision',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstateByHeirs,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.divisionOfEstateByHeirs,
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...representativeOverview,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Seta í óskiptu búi og Eignalaust bú með eignum */
    buildMultiField({
      id: 'overviewEstateDivision',
      title: m.overviewTitle,
      description: (application) => {
        const selectedEstate = getValueViaPath(
          application.answers,
          'selectedEstate',
        )
        return selectedEstate === EstateTypes.permitForUndividedEstate
          ? m.overviewSubtitlePermitToPostpone
          : selectedEstate === EstateTypes.estateWithoutAssets
          ? m.overviewSubtitleWithoutAssets
          : m.overviewSubtitleDivisionOfEstate
      },
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES
          : getValueViaPath(answers, 'selectedEstate') ===
            EstateTypes.permitForUndividedEstate
          ? true
          : false,
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Eignalaust bú án eigna */
    buildMultiField({
      id: 'overviewWithoutAssets',
      title: m.overviewTitle,
      description: m.overviewSubtitleWithoutAssets,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
          EstateTypes.estateWithoutAssets &&
        getValueViaPath(answers, 'estateWithoutAssets.estateAssetsExist') ===
          NO,
      children: [
        ...commonOverviewFields,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),

    /* Opinber Skipti */
    buildMultiField({
      id: 'overviewDivisionOfEstate',
      title: m.overviewTitle,
      description: m.overviewSubtitleDivisionOfEstate,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.officialDivision,
      children: [
        ...deceasedInfoFields,
        buildDescriptionField({
          id: 'space',
          title: '',
          space: 'containerGutter',
        }),
        buildCheckboxField({
          id: 'confirmAction',
          title: '',
          large: true,
          backgroundColor: 'blue',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.divisionOfEstateConfirmActionCheckbox,
            },
          ],
        }),
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
