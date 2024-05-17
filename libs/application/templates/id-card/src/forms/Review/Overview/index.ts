import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  buildSubmitField,
  buildKeyValueField,
  buildDividerField,
  buildCustomField,
} from '@island.is/application/core'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { DefaultEvents } from '@island.is/application/types'
import { Routes } from '../../../lib/constants'
import { review, idInformation } from '../../../lib/messages'
import { GetFormattedText } from '../../../utils'
import { IdCard } from '../../../lib/dataSchema'

export const OverviewSection = buildSection({
  id: 'reviewOverview',
  title: review.general.sectionTitle,
  children: [
    buildMultiField({
      id: `overviewMultiField`,
      title: review.general.pageTitle,
      space: 3,
      description: review.general.description,
      children: [
        /* Child Applicant */
        buildDescriptionField({
          id: 'applicantDescription',
          title: review.labels.applicantDescription,
          titleVariant: 'h3',
        }),
        buildKeyValueField({
          label: review.labels.applicantName,
          colSpan: '6/12',
          value: ({ answers }) => (answers as IdCard).applicantInformation.name,
        }),
        buildKeyValueField({
          label: review.labels.licenseType,
          colSpan: '6/12',
          value: ({ answers }) =>
            (answers as IdCard).typeOfId === 'WithTravel'
              ? idInformation.labels.typeOfIdRadioAnswerOne
              : idInformation.labels.typeOfIdRadioAnswerTwo,
        }),
        // TODO: Check if user has email
        buildKeyValueField({
          label: review.labels.applicantEmail,
          colSpan: '6/12',
          value: ({ answers }) =>
            (answers as IdCard).applicantInformation.email,
        }),
        // TODO: Check if user has phonenumber
        buildKeyValueField({
          label: review.labels.applicantNumber,
          colSpan: '6/12',
          value: ({ answers }) => '',
          //   formatPhoneNumber(
          //     (answers as IdCard).applicantInformation.phoneNumber,
          //   ),
          // condition: (answers) =>
          //   !!(answers as IdCard)?.applicantInformation?.nationalId === answers.,
          // value: ({ answers }) =>
          //   formatPhoneNumber(
          //     (answers as HomeSupport).applicant.phoneNumber,
          //   ),
        }),
        buildDividerField({}),

        /* Parents / Guardians */
        buildDescriptionField({
          id: 'parentDescription',
          title: review.labels.parentDescription,
          titleVariant: 'h3',
        }),
        buildKeyValueField({
          label: review.labels.parentAName,
          colSpan: '6/12',
          value: 'Guðrún Jónsdóttir',
          // value: ({ answers }) => (answers as HomeSupport).applicant.name,
        }),
        buildKeyValueField({
          label: review.labels.parentANationalId,
          colSpan: '6/12',
          value: '012345-6789',
          // value: ({ answers }) =>
          //   (answers as HomeSupport).applicant.nationalId,
        }),
        buildKeyValueField({
          label: review.labels.parentAEmail,
          colSpan: '6/12',
          value: 'guddaj@gmail.com',
          // value: ({ answers }) => (answers as HomeSupport).applicant.email,
        }),
        buildKeyValueField({
          label: review.labels.parentANumber,
          colSpan: '6/12',
          value: '867-8787',
          // condition: (answers) =>
          //   !!(answers as HomeSupport)?.applicant?.phoneNumber,
          // value: ({ answers }) =>
          //   formatPhoneNumber(
          //     (answers as HomeSupport).applicant.phoneNumber,
          //   ),
        }),
        buildKeyValueField({
          label: review.labels.parentBName,
          colSpan: '6/12',
          value: 'Jón Jónsson',
          // value: ({ answers }) => (answers as HomeSupport).applicant.name,
        }),
        buildKeyValueField({
          label: review.labels.parentBNationalId,
          colSpan: '6/12',
          value: '012345-6799',
          // value: ({ answers }) =>
          //   (answers as HomeSupport).applicant.nationalId,
        }),
        buildKeyValueField({
          label: review.labels.parentBEmail,
          colSpan: '6/12',
          value: 'jj@gmail.com',
          // value: ({ answers }) => (answers as HomeSupport).applicant.email,
        }),
        buildKeyValueField({
          label: review.labels.parentBNumber,
          colSpan: '6/12',
          value: '666-8999',
          // condition: (answers) =>
          //   !!(answers as HomeSupport)?.applicant?.phoneNumber,
          // value: ({ answers }) =>
          //   formatPhoneNumber(
          //     (answers as HomeSupport).applicant.phoneNumber,
          //   ),
        }),
        buildDividerField({}),
        buildDescriptionField({
          id: 'deliveryDescription',
          title: review.labels.deliveryDescription,
          titleVariant: 'h3',
        }),
        buildKeyValueField({
          label: review.labels.deliveryOption,
          colSpan: '6/12',
          value: [
            'Almenn afgreiðsla: börn, aldraðir, öryrkjar ',
            '**4.600 kr.**',
          ],
          // value: ({ answers }) => (answers as HomeSupport).applicant.name,
        }),
        buildKeyValueField({
          label: review.labels.deliveryLocation,
          colSpan: '6/12',
          value: 'Þjóðskrá – Borgartúni xX, 105 Reykjavík',
          // value: ({ answers }) =>
          //   (answers as HomeSupport).applicant.nationalId,
        }),

        /* SUBMIT OR DECLINE */
        buildCustomField({
          id: 'overviewApproval',
          component: 'RejectApproveButtons',
          title: '',
          description: '',
        }),
        // buildSubmitField({
        //   id: 'overviewApproval',
        //   title: '',
        //   refetchApplicationAfterSubmit: false,
        //   actions: [
        //     // {
        //     //   event: DefaultEvents.REJECT,
        //     //   name: 'Hafna',
        //     //   type: 'reject',
        //     // },
        //     // {
        //     //   event: DefaultEvents.SUBMIT,
        //     //   name: 'Samþykkja',
        //     //   type: 'primary',
        //     // },
        //   ],
        // }),
      ],
    }),
  ],
})
