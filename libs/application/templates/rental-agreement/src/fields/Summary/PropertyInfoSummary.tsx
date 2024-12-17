import { GridColumn, GridRow, Link, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { RentalAgreement } from '../../lib/dataSchema'
import {
  RentalHousingCategoryClass,
  RentalHousingConditionInspector,
} from '../../lib/constants'
import {
  getPropertyTypeOptions,
  getPropertyClassOptions,
  getPropertyClassGroupOptions,
} from '../../lib/utils'
import { summary } from '../../lib/messages'
import { KeyValue } from './KeyValue'
import { SummarySection } from './SummarySection'
import { Divider } from './Divider'
import { fileLinks, gridRow } from './summaryStyles.css'

type Props = {
  answers: RentalAgreement
}

export const PropertyInfoSummary = ({ answers }: Props) => {
  const { formatMessage } = useLocale()

  const propertyType = (answer: string) => {
    const options = getPropertyTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyClass = (answer: string) => {
    const options = getPropertyClassOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyClassGroup = (answer: string) => {
    const options = getPropertyClassGroupOptions()
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

      <Divider />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertyClassLabel}
            value={
              propertyClass(answers.registerProperty.categoryClass as string) ||
              '-'
            }
          />
        </GridColumn>
        {answers.registerProperty.categoryClass ===
          RentalHousingCategoryClass.SPECIAL_GROUPS &&
          answers.registerProperty.categoryClassGroup && (
            <GridColumn span={['12/12', '4/12']}>
              <KeyValue
                label={summary.propertyClassGroupLabel}
                value={
                  propertyClassGroup(
                    answers.registerProperty.categoryClassGroup as string,
                  ) || '-'
                }
              />
            </GridColumn>
          )}
      </GridRow>

      <Divider />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.propertyDescriptionLabel}
            value={answers.specialProvisions.descriptionInput || '-'}
          />
        </GridColumn>
      </GridRow>

      <Divider />

      <GridRow className={gridRow}>
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.PropertySpecialProvisionsLabel}
            value={answers.specialProvisions.rulesInput || '-'}
          />
        </GridColumn>
      </GridRow>

      <Divider />

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

      <Divider />

      {
        /* Only show the file upload section if the user has uploaded files */
        answers.condition.resultsFiles.length > 0 && (
          <>
            <GridRow className={gridRow}>
              <GridColumn span={['12/12']}>
                <Text
                  variant={'small'}
                  as={'label'}
                  fontWeight="semiBold"
                  marginBottom={1}
                >
                  {formatMessage(summary.fileUploadLabel)}
                </Text>

                <ul>
                  {answers.condition.resultsFiles.map((file) => (
                    <li className={fileLinks} key={file.name}>
                      <Link
                        underline="small"
                        underlineVisibility="hover"
                        color="blue400"
                        href={'http://localhost:4242/umsoknir/leigusamningur'}
                      >
                        {file.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </GridColumn>
            </GridRow>

            <Divider />
          </>
        )
      }

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
