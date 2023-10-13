import {
  buildMultiField,
  buildSubSection,
  buildDescriptionField,
  getValueViaPath,
  buildCustomField,
  buildMessageWithLinkButtonField,
} from '@island.is/application/core'
import { CurrentResidencePermit } from '@island.is/clients/directorate-of-immigration'
import { applicant } from '../../../lib/messages'
import DescriptionText from '../../../components/DescriptionText'
import { DescriptionInlineLink } from '../../../fields'

export const PermanentSubSection = buildSubSection({
  id: 'permanent',
  title: applicant.labels.permanent.subSectionTitle,

  condition: (_, externalData) => {
    const applicantCurrentResidencePermit = getValueViaPath(
      externalData,
      'applicantCurrentResidencePermit.data',
    ) as CurrentResidencePermit

    const childrenCurrentResidencePermit = getValueViaPath(
      externalData,
      'childrenCurrentResidencePermit.data',
      [],
    ) as CurrentResidencePermit[]

    // const canAtLeastOneApplyPermanent = !![
    //   applicantCurrentResidencePermit,
    //   ...childrenCurrentResidencePermit,
    // ].find((x) => x.canApplyPermanent)

    // return canAtLeastOneApplyPermanent

    return true
  },
  children: [
    buildMultiField({
      id: 'permanentMultiField',
      title: applicant.labels.permanent.pageTitle,
      description: '',
      children: [
        buildCustomField({
          id: 'permanentMultiFieldDescription',
          title: '',
          component: 'DescriptionInlineLink',
        }),
        buildCustomField({
          id: 'selectedPermanentIndividuals',
          title: '',
          component: 'SelectIndividuals',
        }),
        // buildMessageWithLinkButtonField({
        //   id: 'openpermanent',
        //   title: applicant.labels.permanent.messageWithLinkTitle,
        //   url: '/',
        //   buttonTitle: applicant.labels.permanent.messageWithLinkButtonTitle,
        //   message: applicant.labels.permanent.messageWithLinkTitle,
        // }),
        buildCustomField(
          {
            id: 'openpermanent',
            title: '',
            component: 'MessageWithLink',
          },
          {
            buttonTitle: applicant.labels.permanent.messageWithLinkButtonTitle,
            buttonUrl: applicant.labels.permanent.messageWithLinkUrl,
            title: applicant.labels.permanent.messageWithLinkTitle,
          },
        ),
      ],
    }),
  ],
})
