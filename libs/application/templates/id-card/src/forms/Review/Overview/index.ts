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
import { Routes } from '../../../lib/constants'
import { review, idInformation, priceList } from '../../../lib/messages'
import {
  isChild,
  formatPhoneNumber,
  hasSecondGuardian,
  checkForDiscount,
  getPriceList,
  formatIsk,
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
            (getValueViaPath(answers, 'typeOfId', '') as string) === 'II'
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
            const applicationPrices = getPriceList(application)
            return priceChoice === Services.EXPRESS && !hasDiscount
              ? {
                  id: priceList.labels.fastPriceTitle.id,
                  values: {
                    price:
                      applicationPrices.fastPrice?.priceAmount &&
                      formatIsk(applicationPrices.fastPrice?.priceAmount),
                  },
                }
              : priceChoice === Services.EXPRESS && hasDiscount
              ? [
                  {
                    id: priceList.labels.discountFastPriceTitle,
                    values: {
                      price:
                        applicationPrices.fastDiscountPrice?.priceAmount &&
                        formatIsk(
                          applicationPrices.fastDiscountPrice?.priceAmount,
                        ),
                    },
                  },
                ]
              : priceChoice === Services.REGULAR && !hasDiscount
              ? [
                  {
                    id: priceList.labels.regularPriceTitle.id,
                    values: {
                      price:
                        applicationPrices.regularPrice?.priceAmount &&
                        formatIsk(applicationPrices.regularPrice?.priceAmount),
                    },
                  },
                ]
              : priceChoice === Services.REGULAR && hasDiscount
              ? [
                  {
                    id: priceList.labels.discountRegularPriceTitle.id,
                    values: {
                      price:
                        applicationPrices.regularDiscountPrice?.priceAmount &&
                        formatIsk(
                          applicationPrices.regularDiscountPrice?.priceAmount,
                        ),
                    },
                  },
                ]
              : ''
          },
        }),

        /* SUBMIT OR DECLINE */
        buildCustomField({
          id: 'overviewApproval',
          component: 'RejectApproveButtons',
          description: '',
        }),
      ],
    }),
  ],
})
