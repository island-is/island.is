import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
  buildKeyValueField,
  buildDividerField,
  buildCustomField,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { DistrictCommissionerAgencies, Routes } from '../../../lib/constants'
import { review, idInformation, priceList } from '../../../lib/messages'
import {
  isChild,
  formatPhoneNumber,
  hasSecondGuardian,
  checkForDiscount,
} from '../../../utils'
import { Services } from '../../../shared/types'

export const OverviewSection = buildSection({
  id: 'reviewOverview',
  title: review.general.sectionTitle,
  children: [
    buildMultiField({
      id: `overviewMultiField`,
      title: review.general.pageTitle,
      description: review.general.description,
      children: [
        /* Child Applicant */
        buildDescriptionField({
          id: 'applicantDescription',
          title: review.labels.applicantDescription,
          marginBottom: 3,
          titleVariant: 'h3',
        }),
        buildKeyValueField({
          label: review.labels.applicantName,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.APPLICANTSINFORMATION}.name`,
              '',
            ) as string,
        }),
        buildKeyValueField({
          label: review.labels.licenseType,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            (getValueViaPath(answers, 'typeOfId', '') as string) ===
            'WithTravel'
              ? idInformation.labels.typeOfIdRadioAnswerOne
              : idInformation.labels.typeOfIdRadioAnswerTwo,
        }),
        buildKeyValueField({
          label: review.labels.applicantEmail,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.APPLICANTSINFORMATION}.email`,
              '',
            ) as string,
          condition: (formValue, externalData) =>
            !isChild(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.applicantNumber,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            formatPhoneNumber(
              getValueViaPath(
                answers,
                `${Routes.APPLICANTSINFORMATION}.phoneNumber`,
                '',
              ) as string,
            ),
          condition: (formValue, externalData) =>
            !isChild(formValue, externalData),
        }),
        buildDividerField({}),

        /* Parents / Guardians */
        buildDescriptionField({
          id: 'parentDescription',
          title: review.labels.parentDescription,
          titleVariant: 'h3',
          marginTop: 3,
          marginBottom: 3,
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentAName,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.FIRSTGUARDIANINFORMATION}.name`,
              '',
            ) as string,
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentANationalId,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            formatNationalId(
              getValueViaPath(
                answers,
                `${Routes.FIRSTGUARDIANINFORMATION}.nationalId`,
                '',
              ) as string,
            ),
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentAEmail,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.FIRSTGUARDIANINFORMATION}.email`,
              '',
            ) as string,
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentANumber,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            formatPhoneNumber(
              getValueViaPath(
                answers,
                `${Routes.FIRSTGUARDIANINFORMATION}.phoneNumber`,
                '',
              ) as string,
            ),
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),

        buildKeyValueField({
          label: review.labels.parentBName,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.SECONDGUARDIANINFORMATION}.name`,
              '',
            ) as string,
          condition: (formValue, externalData) =>
            isChild(formValue, externalData) &&
            hasSecondGuardian(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentBNationalId,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            formatNationalId(
              getValueViaPath(
                answers,
                `${Routes.SECONDGUARDIANINFORMATION}.nationalId`,
                '',
              ) as string,
            ),
          condition: (formValue, externalData) =>
            isChild(formValue, externalData) &&
            hasSecondGuardian(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentBEmail,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            getValueViaPath(
              answers,
              `${Routes.SECONDGUARDIANINFORMATION}.email`,
              '',
            ) as string,
          condition: (formValue, externalData) =>
            isChild(formValue, externalData) &&
            hasSecondGuardian(formValue, externalData),
        }),
        buildKeyValueField({
          label: review.labels.parentBNumber,
          colSpan: '6/12',
          paddingBottom: 3,
          value: ({ answers }) =>
            formatPhoneNumber(
              getValueViaPath(
                answers,
                `${Routes.SECONDGUARDIANINFORMATION}.phoneNumber`,
                '',
              ) as string,
            ),
          condition: (formValue, externalData) =>
            isChild(formValue, externalData) &&
            hasSecondGuardian(formValue, externalData),
        }),
        buildDividerField({
          condition: (formValue, externalData) =>
            isChild(formValue, externalData),
        }),

        buildDescriptionField({
          id: 'deliveryDescription',
          title: review.labels.deliveryDescription,
          titleVariant: 'h3',
          marginTop: 3,
          marginBottom: 3,
        }),
        buildKeyValueField({
          label: review.labels.deliveryOption,
          colSpan: '6/12',
          value: (application) => {
            const { answers } = application
            const priceChoice = getValueViaPath(
              answers,
              `${Routes.PRICELIST}.priceChoice`,
            ) as string
            const hasDiscount = checkForDiscount(application)
            return priceChoice === Services.EXPRESS && !hasDiscount
              ? priceList.labels.fastPriceTitle
              : priceChoice === Services.EXPRESS && hasDiscount
              ? [priceList.labels.discountFastPriceTitle]
              : priceChoice === Services.REGULAR && !hasDiscount
              ? [priceList.labels.regularPriceTitle]
              : priceChoice === Services.REGULAR && hasDiscount
              ? [priceList.labels.discountRegularPriceTitle]
              : ''
          },
        }),
        buildKeyValueField({
          label: review.labels.deliveryLocation,
          colSpan: '6/12',
          value: ({
            answers,
            externalData: {
              deliveryAddress: { data },
            },
          }) => {
            const deliveryAddress = (
              data as DistrictCommissionerAgencies[]
            )?.find(
              ({ key }) =>
                key ===
                (getValueViaPath(
                  answers,
                  `${Routes.PRICELIST}.location`,
                ) as string),
            )
            return `${deliveryAddress?.name} - ${deliveryAddress?.street}, ${deliveryAddress?.zip} ${deliveryAddress?.city}`
          },
        }),

        /* SUBMIT OR DECLINE */
        buildCustomField({
          id: 'overviewApproval',
          component: 'RejectApproveButtons',
          title: '',
          description: '',
        }),
      ],
    }),
  ],
})
