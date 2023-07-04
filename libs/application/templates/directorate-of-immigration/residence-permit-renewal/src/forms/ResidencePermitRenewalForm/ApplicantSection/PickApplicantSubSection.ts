import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
  buildDescriptionField,
} from '@island.is/application/core'
import { CurrentResidencePermit } from '@island.is/clients/directorate-of-immigration/residence-permit'
import { applicant } from '../../../lib/messages'

export const PickApplicantSubSection = buildSubSection({
  id: 'pickApplicant',
  title: applicant.labels.pickApplicant.subSectionTitle,
  children: [
    buildMultiField({
      id: 'pickChildrenMultiField',
      title: applicant.labels.pickApplicant.pageTitle,
      children: [
        buildCustomField(
          {
            id: 'attentionPickApplicant',
            title: applicant.labels.pickApplicant.warningTitle,
            component: 'AlertWithLink',
            condition: (_, externalData) => {
              //TODOx skoða líka ef það er amk 1 barn sem má sækja um fyrir (sem er þá á fjölskyldusameiningu og á að sjá þetta warning)
              const isPermitTypeFamily = getValueViaPath(
                externalData,
                'currentResidencePermit.data.isPermitTypeFamily',
                false,
              ) as boolean

              return isPermitTypeFamily
            },
          },
          {
            title: applicant.labels.pickApplicant.warningTitle,
            message: applicant.labels.pickApplicant.warningMessage,
            linkTitle: applicant.labels.pickApplicant.warningLinkMessage,
            linkUrl: applicant.labels.pickApplicant.warningLinkUrl,
          },
        ),
        buildDescriptionField({
          id: 'selectedIndividuals.title',
          title: applicant.labels.pickApplicant.title,
          description: applicant.labels.pickApplicant.description,
          titleVariant: 'h5',
          space: 3,
        }),
        buildCustomField({
          id: 'selectedIndividuals',
          title: applicant.labels.pickApplicant.pageTitle,
          component: 'SelectIndividuals',
        }),
        buildCustomField(
          {
            id: 'generalMessage',
            title: 'Upplýsingar',
            component: 'InformationBoxWithLink',
            // TODO condition ef eitt barn er með sameiginlega forsjá
          },
          {
            title: applicant.labels.pickApplicant.infoTitle,
            message: applicant.labels.pickApplicant.infoMessage,
            linkTitle: applicant.labels.pickApplicant.infoLinkMessage,
            linkUrl: applicant.labels.pickApplicant.infoLinkUrl,
          },
        ),
      ],
    }),
  ],
})
