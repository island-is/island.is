import { FieldBaseProps, GenericFormField } from '@island.is/application/types'
import { FC, useEffect } from 'react'
import {
  Box,
  Text,
  Button,
  GridColumn,
  GridRow,
} from '@island.is/island-ui/core'
import {
  CheckboxController,
  DatePickerController,
  InputController,
  SelectController,
} from '@island.is/shared/form-fields'
import { useLocale } from '@island.is/localization'
import { formerEducation } from '../../lib/messages/formerEducation'
import { getAllCountryCodes } from '@island.is/shared/utils'
import { FileUploadController } from '@island.is/application/ui-components'
import { useFormContext } from 'react-hook-form'
import { EducationDetailsItem } from '../../shared/types'
import { degreeLevelOptions } from '../../lib/constants'
import { YES } from '@island.is/application/core'

interface DetailsRepeaterItemProps extends FieldBaseProps {
  index: number
  repeaterField: GenericFormField<EducationDetailsItem>
  id: string
  itemNumber: number
  handleRemove: (index: number) => void
  addDataToEducationList: (field: string, value: string, index: number) => void
  readOnly?: boolean
  removeable: boolean
}

export const DetailsRepeaterItem: FC<DetailsRepeaterItemProps> = ({
  id,
  application,
  index,
  repeaterField,
  itemNumber,
  handleRemove,
  addDataToEducationList,
  readOnly,
  removeable,
}) => {
  const { formatMessage } = useLocale()
  const countries = getAllCountryCodes()
  const { setValue } = useFormContext()

  const fieldIndex = `${id}[${index}]`
  const schoolField = `${fieldIndex}.school`
  const degreeLevelField = `${fieldIndex}.degreeLevel`
  const degreeMajorField = `${fieldIndex}.degreeMajor`
  const finishedUnitsField = `${fieldIndex}.finishedUnits`
  const averageGradeField = `${fieldIndex}.averageGrade`
  const beginningDateField = `${fieldIndex}.beginningDate`
  const endDateField = `${fieldIndex}.endDate`
  const degreeFinishedField = `${fieldIndex}.degreeFinished`
  const degreeCountryField = `${fieldIndex}.degreeCountry`
  const degreeAttachmentsField = `${fieldIndex}.degreeAttachments`
  const moreDetailsField = `${fieldIndex}.moreDetails`
  const wasRemovedField = `${fieldIndex}.wasRemoved`
  const readOnlyField = `${fieldIndex}.readOnly`

  useEffect(() => {
    setValue(schoolField, repeaterField.school)
  }, [repeaterField.school, setValue, schoolField])

  useEffect(() => {
    setValue(degreeLevelField, repeaterField.degreeLevel)
  }, [repeaterField.degreeLevel, setValue, degreeLevelField])

  useEffect(() => {
    setValue(degreeMajorField, repeaterField.degreeMajor)
  }, [repeaterField.degreeMajor, setValue, degreeMajorField])

  useEffect(() => {
    setValue(finishedUnitsField, repeaterField.finishedUnits)
  }, [repeaterField.finishedUnits, setValue, finishedUnitsField])

  useEffect(() => {
    setValue(averageGradeField, repeaterField.averageGrade)
  }, [repeaterField.averageGrade, setValue, averageGradeField])

  useEffect(() => {
    setValue(beginningDateField, repeaterField.beginningDate)
  }, [repeaterField.beginningDate, setValue, beginningDateField])

  useEffect(() => {
    setValue(endDateField, repeaterField.endDate)
  }, [repeaterField.endDate, setValue, endDateField])

  useEffect(() => {
    setValue(degreeFinishedField, repeaterField.degreeFinished)
  }, [repeaterField.degreeFinished, setValue, degreeFinishedField])

  useEffect(() => {
    setValue(degreeCountryField, repeaterField.degreeCountry)
  }, [repeaterField.degreeCountry, setValue, degreeCountryField])

  useEffect(() => {
    setValue(degreeAttachmentsField, repeaterField.degreeAttachments)
  }, [repeaterField.degreeAttachments, setValue, degreeAttachmentsField])

  useEffect(() => {
    setValue(moreDetailsField, repeaterField.moreDetails)
  }, [repeaterField.moreDetails, setValue, moreDetailsField])

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue, wasRemovedField])

  useEffect(() => {
    setValue(readOnlyField, repeaterField.readOnly)
  }, [repeaterField.readOnly, setValue, readOnlyField])

  return (
    <Box
      position="relative"
      marginBottom={2}
      hidden={repeaterField.wasRemoved === 'true' && !readOnly}
    >
      {itemNumber > 0 && (
        <Text variant="h5">
          {formatMessage(formerEducation.labels.educationDetails.itemTitle, {
            index: itemNumber + 1,
          })}
        </Text>
      )}
      {removeable && (
        <Box display="flex" flexDirection="row" justifyContent="flexEnd">
          <Button
            variant="text"
            size="small"
            onClick={() => handleRemove(index)}
          >
            {formatMessage(
              formerEducation.labels.educationDetails.deleteItemButtonTitle,
            )}
          </Button>
        </Box>
      )}
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={schoolField}
            label={formatMessage(
              formerEducation.labels.educationDetails.schoolLabel,
            )}
            backgroundColor="blue"
            required
            readOnly={readOnly}
            onChange={(value) =>
              addDataToEducationList(
                'school',
                value.target.value as string,
                index,
              )
            }
          />
        </GridColumn>
        {!readOnly ? (
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <SelectController
              id={degreeLevelField}
              label={formatMessage(
                formerEducation.labels.educationDetails.degreeLevelLabel,
              )}
              backgroundColor="blue"
              required={repeaterField.wasRemoved === 'true' ? false : true}
              onSelect={(value) =>
                addDataToEducationList(
                  'degreeLevel',
                  value.value as string,
                  index,
                )
              }
              options={degreeLevelOptions.map((x) => ({
                label: formatMessage(x.label),
                value: x.value,
              }))}
            />
          </GridColumn>
        ) : (
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={degreeLevelField}
              defaultValue={repeaterField.degreeLevel}
              label={formatMessage(
                formerEducation.labels.educationDetails.degreeLevelLabel,
              )}
              readOnly={readOnly}
            />
          </GridColumn>
        )}
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={degreeMajorField}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeMajorLabel,
            )}
            backgroundColor="blue"
            readOnly={readOnly}
            onChange={(value) =>
              addDataToEducationList(
                'degreeMajor',
                value.target.value as string,
                index,
              )
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={finishedUnitsField}
            type="text"
            label={formatMessage(
              formerEducation.labels.educationDetails.finishedUnitsLabel,
            )}
            backgroundColor="blue"
            readOnly={readOnly}
            onChange={(value) =>
              addDataToEducationList(
                'finishedUnits',
                value.target.value as string,
                index,
              )
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        {!readOnly && (
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={averageGradeField}
              type="text"
              format="####"
              label={formatMessage(
                formerEducation.labels.educationDetails.averageGradeLabel,
              )}
              backgroundColor="blue"
              readOnly={readOnly}
              onChange={(value) =>
                addDataToEducationList(
                  'averageGrade',
                  value.target.value as string,
                  index,
                )
              }
            />
          </GridColumn>
        )}

        {!readOnly ? (
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <SelectController
              id={degreeCountryField}
              label={formatMessage(
                formerEducation.labels.educationDetails.degreeCountryLabel,
              )}
              options={countries.map((country) => {
                return {
                  label: country.name_is || country.name,
                  value: country.code,
                }
              })}
              required={repeaterField.wasRemoved === 'true' ? false : true}
              backgroundColor="blue"
              onSelect={(value) =>
                addDataToEducationList(
                  'degreeCountry',
                  value.value as string,
                  index,
                )
              }
            />
          </GridColumn>
        ) : (
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <InputController
              id={degreeCountryField}
              label={formatMessage(
                formerEducation.labels.educationDetails.degreeCountryLabel,
              )}
            />
          </GridColumn>
        )}

        {readOnly && (
          <GridColumn
            span={['1/1', '1/1', '1/2']}
            paddingTop={2}
            paddingBottom={2}
          >
            <DatePickerController
              id={endDateField}
              required
              label={formatMessage(
                formerEducation.labels.educationDetails.endDateLabel,
              )}
              readOnly={readOnly}
              backgroundColor="blue"
              onChange={(value) =>
                addDataToEducationList('endDate', value as string, index)
              }
            />
          </GridColumn>
        )}
      </GridRow>

      {!readOnly && (
        <GridRow>
          <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
            <DatePickerController
              id={beginningDateField}
              label={formatMessage(
                formerEducation.labels.educationDetails.beginningDateLabel,
              )}
              backgroundColor="blue"
              readOnly={readOnly}
              onChange={(value) =>
                addDataToEducationList('beginningDate', value as string, index)
              }
            />
          </GridColumn>

          <GridColumn
            span={['1/1', '1/1', '1/2']}
            paddingTop={2}
            paddingBottom={2}
          >
            <DatePickerController
              id={endDateField}
              required
              label={formatMessage(
                formerEducation.labels.educationDetails.endDateLabel,
              )}
              readOnly={readOnly}
              backgroundColor="blue"
              onChange={(value) =>
                addDataToEducationList('endDate', value as string, index)
              }
            />
          </GridColumn>
        </GridRow>
      )}

      {!readOnly && (
        <CheckboxController
          id={degreeFinishedField}
          backgroundColor="blue"
          large
          spacing={2}
          options={[
            {
              label: formatMessage(
                formerEducation.labels.educationDetails
                  .degreeFinishedCheckboxLabel,
              ),
              value: YES,
            },
          ]}
          onSelect={(value) =>
            addDataToEducationList('degreeFinished', value[0] as string, index)
          }
        />
      )}

      {!readOnly && (
        <FileUploadController
          id={degreeAttachmentsField} //profskirteini, profskirteini2, profskirteini3
          application={application}
          multiple
          header={formatMessage(
            formerEducation.labels.educationDetails.degreeFileUploadTitle,
          )}
          description={formatMessage(
            formerEducation.labels.educationDetails.degreeFileUploadDescription,
          )}
          buttonLabel={formatMessage(
            formerEducation.labels.educationDetails.degreeFileUploadButtonLabel,
          )}
        />
      )}
      {!readOnly && (
        <Box marginTop={2}>
          <InputController
            id={moreDetailsField}
            textarea
            backgroundColor="blue"
            label={formatMessage(
              formerEducation.labels.educationDetails.moreDetailsLabel,
            )}
            onChange={(value) =>
              addDataToEducationList(
                'moreDetails',
                value.target.value as string,
                index,
              )
            }
          />
        </Box>
      )}
    </Box>
  )
}
