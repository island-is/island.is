import { FC } from 'react'
import {
  Box,
  Button,
  GridColumn,
  Text,
  UploadFile,
} from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import {
  RentalHousingCategoryClass,
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  Routes,
} from '../../lib/constants'
import {
  getPropertyTypeOptions,
  getPropertyClassGroupOptions,
} from '../../lib/utils'
import { KeyValue } from './components/KeyValue'
import { SummaryCardRow } from './components/SummaryCardRow'
import { SummaryCard } from './components/SummaryCard'

import { fileLink, fileLinksList } from './summaryStyles.css'
import { summary } from '../../lib/messages'
import { FieldBaseProps, FormValue } from '@island.is/application/types'

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
    fileUploadRoute,
    fireProtectionsRoute,
    hasChangeButton,
  } = props
  const { answers } = application

  const propertyType = (answer: string) => {
    const options = getPropertyTypeOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const propertyClass = (answer: string) => {
    if (answer === RentalHousingCategoryClass.SPECIAL_GROUPS) {
      return formatMessage(summary.propertyClassSpecialGroups)
    }
    return formatMessage(summary.propertyClassGeneralMarket)
  }

  const propertyClassGroup = (answer: string) => {
    const options = getPropertyClassGroupOptions()
    const matchingOption = options.find((option) => option.value === answer)
    return matchingOption ? matchingOption.label : '-'
  }

  const uploadFiles = getValueViaPath<UploadFile[]>(
    answers,
    'condition.resultsFiles',
  )

  const categoryClass = getValueViaPath<RentalHousingCategoryClass>(
    answers,
    'registerProperty.categoryClass',
  )

  const categoryType = getValueViaPath<RentalHousingCategoryTypes>(
    answers,
    'registerProperty.categoryType',
  )

  const categoryClassGroup = getValueViaPath<RentalHousingCategoryClassGroup>(
    answers,
    'registerProperty.categoryClassGroup',
  )

  const searchResultUnits = getValueViaPath<FormValue[]>(
    answers,
    'registerProperty.searchresults.units',
  )

  const inspector = getValueViaPath<RentalHousingConditionInspector>(
    answers,
    'condition.inspector',
  )

  const inspectorName = getValueViaPath(answers, 'condition.inspectorName', '')

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
            value={propertyType(categoryType || '-')}
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
                value={propertyClassGroup(categoryClassGroup || '-')}
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
            value={(
              searchResultUnits?.reduce(
                (total, unit) => total + ((unit.numOfRooms as number) || 0),
                0,
              ) || 0
            ).toString()}
          />
        </GridColumn>
        <GridColumn span={['12/12', '4/12']}>
          <KeyValue
            label={summary.propertySizeLabel}
            value={(
              searchResultUnits?.reduce(
                (total, unit) =>
                  total +
                  (unit.changedSize && unit.changedSize !== 0
                    ? (unit.changedSize as number)
                    : (unit.size as number) || 0),
                0,
              ) || 0
            ).toString()}
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
            value={
              getValueViaPath(
                answers,
                'specialProvisions.descriptionInput',
                '',
              ) || ''
            }
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
            value={
              getValueViaPath(answers, 'specialProvisions.rulesInput', '') || ''
            }
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
            value={
              getValueViaPath(answers, 'condition.resultsDescription', '') || ''
            }
          />
        </GridColumn>
      </SummaryCardRow>

      {uploadFiles && uploadFiles.length > 0 && (
        <SummaryCardRow
          editAction={goToScreen}
          route={fileUploadRoute}
          hasChangeButton={hasChangeButton}
        >
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
                {uploadFiles.map((file) => (
                  <li key={file.name} className={fileLink}>
                    <Button
                      key={file.name}
                      icon="download"
                      variant="text"
                      size="small"
                      iconType="outline"
                      truncate={true}
                      onClick={() => {
                        // TODO: Fix this
                        const fileUrl = new URL(
                          file.key as string,
                          window.location.origin,
                        )
                        if (
                          fileUrl.origin === window.location.origin ||
                          process.env.ALLOWED_FILE_DOMAINS?.includes(
                            fileUrl.origin,
                          )
                        ) {
                          window.open(
                            fileUrl.toString(),
                            '_blank',
                            'noopener,noreferrer',
                          )
                        } else {
                          console.error(
                            'Attempted to open file from disallowed origin:',
                            fileUrl.origin,
                          )
                        }
                      }}
                    >
                      {file.name}
                    </Button>
                  </li>
                ))}
              </ul>
            </Box>
          </GridColumn>
        </SummaryCardRow>
      )}

      <SummaryCardRow
        editAction={goToScreen}
        route={fireProtectionsRoute}
        hasChangeButton={hasChangeButton}
        isLast={true}
      >
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsSmokeDetectorsLabel}
            value={
              getValueViaPath(answers, 'fireProtections.smokeDetectors', '') ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireExtinguisherLabel}
            value={
              getValueViaPath(
                answers,
                'fireProtections.fireExtinguisher',
                '',
              ) || '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsExitsLabel}
            value={
              getValueViaPath(answers, 'fireProtections.emergencyExits', '') ||
              '-'
            }
          />
        </GridColumn>
        <GridColumn span={['12/12', '6/12', '6/12', '6/12', '3/12']}>
          <KeyValue
            label={summary.fireProtectionsFireBlanketLabel}
            value={
              getValueViaPath(answers, 'fireProtections.fireBlanket', '') || '-'
            }
          />
        </GridColumn>
      </SummaryCardRow>
    </SummaryCard>
  )
}
