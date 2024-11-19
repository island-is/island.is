import { GridColumn, GridRow } from '@island.is/island-ui/core'
import { RentalAgreement } from '../../lib/dataSchema'
import { summary } from '../../lib/messages'
import { divider, gridRow } from './summaryStyles.css'
import { useLocale } from '@island.is/localization'
import { KeyValue } from './KeyValue'
import { RentalHousingConditionInspector } from '../../lib/constants'
import {
  getPropertyCategoryClassOptions,
  getPropertyCategoryTypeOptions,
} from '../../lib/utils'
import { SummarySection } from './SummarySection'

type Props = {
  answers: RentalAgreement
}

export const PropertyInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const propertyType = (answer: string) => {
    const options = getPropertyCategoryTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyCategory = (answer: string) => {
    const options = getPropertyCategoryClassOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  return (
    <SummarySection sectionLabel={formatMessage(summary.propertyInfoHeader)}>
      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertyTypeLabel}
            value={
              propertyType(answers.registerProperty.categoryType as string) ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.PropertyNumOfRoomsLabel}
            value={answers.registerProperty.numOfRooms || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertySizeLabel}
            value={answers.registerProperty.size || '-'}
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.propertyCategoryLabel}
            value={
              propertyCategory(
                answers.registerProperty.categoryClass as string,
              ) || '-'
            }
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.propertyDescriptionLabel}
            value={answers.specialProvisions.descriptionInput || '-'}
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.PropertySpecialProvisionsLabel}
            value={answers.specialProvisions.rulesInput || '-'}
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertyConditionInspectorLabel}
            value={
              answers.condition.inspector ===
                RentalHousingConditionInspector.INDEPENDENT_PARTY &&
              answers.condition.inspectorName
                ? `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}${answers.condition.inspectorName}`
                : `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}${formatMessage(
                    summary.propertyConditionInspectorValueContractParties,
                  )}`
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '8/12']}>
          <KeyValue
            label={summary.propertyConditionDescriptionLabel}
            value={answers.condition.resultsDescription || '-'}
          />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue label={summary.fileUploadLabel} value={'---'} />
        </GridColumn>
      </GridRow>

      <div className={divider} />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsSmokeDetectorsLabel}
            value={answers.fireProtections.smokeDetectors || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireExtinguisherLabel}
            value={answers.fireProtections.fireExtinguisher || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsExitsLabel}
            value={answers.fireProtections.exits || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireBlanketLabel}
            value={answers.fireProtections.fireBlanket || '-'}
          />
        </GridColumn>
      </GridRow>
    </SummarySection>
  )
}
