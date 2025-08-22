import { FC } from 'react'
import { ActionCard, Box, GridColumn, Text } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { FieldBaseProps } from '@island.is/application/types'
import { applicationAnswers, RentalHousingCategoryClass } from '../../shared'
import {
  getPropertyTypeOptions,
  getPropertyClassGroupOptions,
  getEmergencyExitOptions,
  getRentalPropertySize,
} from '../../utils/utils'
import { Routes, RentalHousingConditionInspector } from '../../utils/enums'
import { getOptionLabel } from '../../utils/summaryUtils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'
import { fileLink, fileLinksList } from './summaryStyles.css'
import { summary } from '../../lib/messages'

interface Props extends FieldBaseProps {
  goToScreen?: (id: string) => void
  categoryRoute?: Routes
  propertySearchRoute?: Routes
  propertyDescriptionRoute?: Routes
  specialProvisionsRoute?: Routes
  propertyConditionRoute?: Routes
  fileUploadRoute?: Routes
  fireProtectionsRoute?: Routes
  hasChangeButton: boolean
}

export const PropertyInfoSummary: FC<Props> = ({ ...props }) => {
  const { formatMessage } = useLocale()
  const {
    application,
    goToScreen,
    categoryRoute,
    propertySearchRoute,
    propertyDescriptionRoute,
    specialProvisionsRoute,
    propertyConditionRoute,
    fireProtectionsRoute,
    hasChangeButton,
  } = props
  const { answers } = application

  const propertyClass = (answer: string) => {
    if (answer === RentalHousingCategoryClass.SPECIAL_GROUPS) {
      return formatMessage(summary.propertyClassSpecialGroups)
    }
    return formatMessage(summary.propertyClassGeneralMarket)
  }

  const {
    files,
    categoryClass,
    categoryType,
    categoryClassGroup,
    units,
    inspector,
    inspectorName,
    conditionDescription,
    description,
    rules,
    smokeDetectors,
    fireExtinguisher,
    emergencyExits,
    fireBlanket,
  } = applicationAnswers(answers)

  const numOfRooms = units
    ?.reduce((total, unit) => total + (unit.numOfRooms || 0), 0)
    .toString()

  const propertySize = getRentalPropertySize(units).toString()

  return (
    <SummaryCard cardLabel={formatMessage(summary.propertyInfoHeader)}>
      <SummaryCardRow
        editAction={goToScreen}
        route={categoryRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <KeyValue
            label={summary.propertyTypeLabel}
            value={getOptionLabel(
              categoryType || '',
              getPropertyTypeOptions,
              '',
            )}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '4/12']}>
          <KeyValue
            label={summary.propertyClassLabel}
            value={propertyClass(categoryClass || '-')}
          />
        </GridColumn>
        {categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS &&
          categoryClassGroup && (
            <GridColumn span={['12/12', '12/12', '12/12', '12/12', '4/12']}>
              <KeyValue
                label={summary.propertyClassGroupLabel}
                value={getOptionLabel(
                  categoryClassGroup || '',
                  getPropertyClassGroupOptions,
                  '',
                )}
              />
            </GridColumn>
          )}
      </SummaryCardRow>

      <SummaryCardRow
        editAction={goToScreen}
        route={propertySearchRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.PropertyNumOfRoomsLabel}
            value={numOfRooms || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertySizeLabel}
            value={propertySize || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow
        editAction={goToScreen}
        route={propertyDescriptionRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.propertyDescriptionLabel}
            value={description || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow
        editAction={goToScreen}
        route={specialProvisionsRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12']}>
          <KeyValue
            label={summary.PropertySpecialProvisionsLabel}
            value={rules || '-'}
          />
        </GridColumn>
      </SummaryCardRow>

      <SummaryCardRow
        editAction={goToScreen}
        route={propertyConditionRoute}
        hasChangeButton={hasChangeButton}
      >
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '4/12']}>
          <KeyValue
            label={summary.propertyConditionInspectorLabel}
            value={
              inspector === RentalHousingConditionInspector.INDEPENDENT_PARTY &&
              inspectorName
                ? `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}: ${inspectorName}`
                : `${formatMessage(
                    summary.propertyConditionInspectorValuePrefix,
                  )}${formatMessage(
                    summary.propertyConditionInspectorValueContractParties,
                  )}`
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '12/12', '12/12', '12/12', '8/12']}>
          <KeyValue
            label={summary.propertyConditionDescriptionLabel}
            value={conditionDescription || ''}
          />
        </GridColumn>
        {files && files.length > 0 && (
          <GridColumn span={['12/12']}>
            <Box paddingY={'p2'}>
              <Text
                variant={'small'}
                as={'label'}
                fontWeight="semiBold"
                marginBottom={1}
              >
                {formatMessage(summary.fileUploadLabel)}
              </Text>
              <ul className={fileLinksList}>
                {files.map((file) => (
                  <li key={file.name} className={fileLink}>
                    <ActionCard
                      heading={file.name}
                      headingVariant="h4"
                      backgroundColor="blue"
                    />
                  </li>
                ))}
              </ul>
            </Box>
          </GridColumn>
        )}
      </SummaryCardRow>

      <SummaryCardRow
        editAction={goToScreen}
        route={fireProtectionsRoute}
        hasChangeButton={hasChangeButton}
        isLast={true}
      >
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsSmokeDetectorsLabel}
            value={smokeDetectors || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireExtinguisherLabel}
            value={fireExtinguisher || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireBlanketLabel}
            value={fireBlanket || '-'}
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsEmergencyExitsLabel}
            value={
              getOptionLabel(
                emergencyExits || '',
                getEmergencyExitOptions,
                '',
              ) || '-'
            }
          />
        </GridColumn>
      </SummaryCardRow>
    </SummaryCard>
  )
}
