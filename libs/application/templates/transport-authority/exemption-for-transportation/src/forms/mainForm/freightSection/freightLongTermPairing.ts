import {
  buildAlertMessageField,
  buildDescriptionField,
  buildFieldsRepeaterField,
  buildHiddenInput,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { freight } from '../../../lib/messages'
import { Application, SubSection } from '@island.is/application/types'
import {
  getConvoyItem,
  getConvoyItems,
  getConvoyShortName,
  getFreightItem,
  checkIfExemptionTypeLongTerm,
  MAX_CNT_CONVOY,
  MAX_CNT_FREIGHT,
  getFreightPairingLongTermErrorMessage,
  checkHasSelectedConvoyInFreightPairing,
  getSelectedConvoyIdsInFreightPairing,
} from '../../../utils'
import { ExemptionFor } from '../../../shared'
import { FreightCommonHiddenInputs } from './freightCommonHiddenInputs'

const FreightPairingSubSection = (freightIndex: number) =>
  buildSubSection({
    id: `freightLongTermPairingSubSection.${freightIndex}`,
    condition: (answers) =>
      checkIfExemptionTypeLongTerm(answers) &&
      !!getFreightItem(answers, freightIndex),
    title: (application) => {
      const freightItem = getFreightItem(application.answers, freightIndex)
      return {
        ...freight.pairing.subSectionTitle,
        values: {
          freightNumber: freightIndex + 1,
          freightName: freightItem?.name,
        },
      }
    },
    children: [
      buildMultiField({
        id: `freightLongTermPairingMultiField.${freightIndex}`,
        title: (application) => {
          const freightItem = getFreightItem(application.answers, freightIndex)
          return {
            ...freight.pairing.pageTitle,
            values: {
              freightNumber: freightIndex + 1,
              freightName: freightItem?.name,
            },
          }
        },
        description: freight.pairing.description,
        children: [
          ...FreightCommonHiddenInputs(`freightPairing.${freightIndex}`),
          buildHiddenInput({
            id: `freightPairing.${freightIndex}.freightId`,
            defaultValue: (application: Application) =>
              getFreightItem(application.answers, freightIndex)?.freightId,
          }),

          buildTextField({
            id: `freightPairing.${freightIndex}.length`,
            title: freight.labels.freightLength,
            backgroundColor: 'blue',
            width: 'half',
            required: true,
            variant: 'number',
            thousandSeparator: true,
            suffix: freight.labels.metersSuffix,
          }),
          buildTextField({
            id: `freightPairing.${freightIndex}.weight`,
            title: freight.labels.freightWeight,
            backgroundColor: 'blue',
            width: 'half',
            required: true,
            variant: 'number',
            thousandSeparator: true,
            suffix: freight.labels.tonsSuffix,
          }),

          buildDescriptionField({
            id: `freightLongTermPairingDescription.${freightIndex}.subtitle`,
            title: freight.labels.pairingConvoyListSubtitle,
            titleVariant: 'h5',
          }),
          buildSelectField({
            id: `freightPairing.${freightIndex}.convoyIdList`,
            title: freight.labels.pairingConvoyList,
            width: 'full',
            required: true,
            isMulti: true,
            options: (application) => {
              const convoyItems = getConvoyItems(application.answers)
              return convoyItems.map((item, convoyIndex) => ({
                label: {
                  ...freight.labels.pairingConvoyOption,
                  values: {
                    convoyNumber: convoyIndex + 1,
                    vehicleAndTrailerPermno: getConvoyShortName(item),
                  },
                },
                value: item.convoyId,
              }))
            },
          }),

          buildFieldsRepeaterField({
            id: `freightPairing.${freightIndex}.items`,
            displayTitleAsAccordion: true,
            formTitle: (convoyIndex, application) => {
              const convoyItem = getConvoyItem(application.answers, convoyIndex)
              if (!convoyItem) return ''
              return {
                ...freight.labels.pairingFreightWithConvoySubtitle,
                values: {
                  convoyNumber: convoyIndex + 1,
                  vehicleAndTrailerPermno: getConvoyShortName(convoyItem),
                },
              }
            },
            titleVariant: 'h5',
            formTitleNumbering: 'none',
            hideAddButton: true,
            hideRemoveButton: true,
            minRows: MAX_CNT_CONVOY, // To set the initial numberOfItems to loop through
            condition: (answers) =>
              getSelectedConvoyIdsInFreightPairing(answers, freightIndex)
                .length > 0,
            itemCondition: (convoyIndex, application) =>
              checkHasSelectedConvoyInFreightPairing(
                application.answers,
                freightIndex,
                convoyIndex,
              ),
            fields: {
              convoyId: {
                component: 'hiddenInput',
                defaultValue: (
                  application: Application,
                  _: unknown,
                  index: number,
                ) => getConvoyItem(application.answers, index)?.convoyId,
                displayInTable: false,
              },
              exemptionForTitle: {
                component: 'description',
                title: freight.labels.exemptionFor,
                titleVariant: 'h5',
                required: true,
              },
              exemptionFor: {
                component: 'checkbox',
                large: true,
                backgroundColor: 'blue',
                width: 'half',
                required: true,
                options: [
                  {
                    value: ExemptionFor.WIDTH,
                    label: freight.exemptionFor.widthOptionTitle,
                  },
                  {
                    value: ExemptionFor.HEIGHT,
                    label: freight.exemptionFor.heightOptionTitle,
                  },
                  {
                    value: ExemptionFor.LENGTH,
                    label: freight.exemptionFor.lengthOptionTitle,
                  },
                  {
                    value: ExemptionFor.WEIGHT,
                    label: freight.exemptionFor.weightOptionTitle,
                  },
                ],
              },
              informationTitle: {
                component: 'description',
                title: freight.labels.freightSubtitle,
                titleVariant: 'h5',
              },
              height: {
                component: 'input',
                type: 'number',
                label: freight.labels.heightWithConvoy,
                width: 'half',
                suffix: freight.labels.metersSuffix,
                thousandSeparator: true,
                required: true,
              },
              width: {
                component: 'input',
                type: 'number',
                label: freight.labels.widthWithConvoy,
                width: 'half',
                suffix: freight.labels.metersSuffix,
                thousandSeparator: true,
                required: true,
              },
              totalLength: {
                component: 'input',
                type: 'number',
                label: freight.labels.totalLengthWithConvoy,
                width: 'full',
                suffix: freight.labels.metersSuffix,
                thousandSeparator: true,
                required: true,
              },
            },
          }),
          buildAlertMessageField({
            id: `freightPairing.alertValidation.${freightIndex}`,
            title: freight.create.errorAlertMessageTitle,
            message: (application) =>
              getFreightPairingLongTermErrorMessage(
                application.externalData,
                application.answers,
                freightIndex,
              ) || '',
            condition: (answers, externalData) =>
              !!getFreightPairingLongTermErrorMessage(
                externalData,
                answers,
                freightIndex,
              ),
            doesNotRequireAnswer: true,
            alertType: 'error',
            shouldBlockInSetBeforeSubmitCallback: true,
          }),
        ],
      }),
    ],
  })

export const FreightLongTermPairingSubSections: SubSection[] = Array(
  MAX_CNT_FREIGHT,
)
  .fill(null)
  .map((_, freightIndex) => FreightPairingSubSection(freightIndex))
