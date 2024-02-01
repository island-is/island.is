import {
  FieldBaseProps,
  GenericFormField,
  YES,
} from '@island.is/application/types'
import { FC, useEffect } from 'react'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { Routes } from '../../lib/constants'
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
import { HiddenTextInput } from '../HiddenTextInput'
import { EducationDetailsItem } from '../../shared/types'

interface DetailsRepeaterItemProps extends FieldBaseProps {
  index: number
  repeaterField: GenericFormField<EducationDetailsItem>
  id: string
  itemNumber: number
  handleRemove: (index: number) => void
  addDataToEducationList: (field: string, value: string, index: number) => void
}

export const DetailsRepeaterItem: FC<DetailsRepeaterItemProps> = ({
  id,
  application,
  field,
  goToScreen,
  index,
  repeaterField,
  itemNumber,
  handleRemove,
  addDataToEducationList,
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
    console.log('changed here', repeaterField.wasRemoved)
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue, wasRemovedField])
  console.log('repeaterField', repeaterField)
  return (
    <Box
      position="relative"
      marginBottom={1}
      hidden={repeaterField.wasRemoved === 'true'}
    >
      {itemNumber > 0 && (
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
            onChange={(value) =>
              addDataToEducationList(
                'school',
                value.target.value as string,
                index,
              )
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <SelectController
            id={degreeLevelField}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeLevelLabel,
            )}
            backgroundColor="blue"
            required
            onSelect={(value) =>
              addDataToEducationList(
                'degreeLevel',
                value.value as string,
                index,
              )
            }
            options={
              // TODO insert correct options
              [
                {
                  label: 'Stúdentspróf',
                  value: 'studentsprof',
                },
                {
                  label: 'Sveinspróf',
                  value: 'sveinsprof',
                },
              ]
            }
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={degreeMajorField}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeMajorLabel,
            )}
            backgroundColor="blue"
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
            type="number"
            label={formatMessage(
              formerEducation.labels.educationDetails.finishedUnitsLabel,
            )}
            backgroundColor="blue"
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
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={averageGradeField}
            type="number"
            label={formatMessage(
              formerEducation.labels.educationDetails.averageGradeLabel,
            )}
            backgroundColor="blue"
            onChange={(value) =>
              addDataToEducationList(
                'averageGrade',
                value.target.value as string,
                index,
              )
            }
          />
        </GridColumn>

        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <SelectController
            id={degreeCountryField}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeCountryLabel,
            )}
            required
            options={countries.map((country) => {
              return {
                label: country.name_is || country.name,
                value: country.code,
              }
            })}
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
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <DatePickerController
            id={beginningDateField}
            required
            label={formatMessage(
              formerEducation.labels.educationDetails.beginningDateLabel,
            )}
            backgroundColor="blue"
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
            backgroundColor="blue"
            onChange={(value) =>
              addDataToEducationList('endDate', value as string, index)
            }
          />
        </GridColumn>
      </GridRow>
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
          addDataToEducationList('degreeLevel', value[0] as string, index)
        }
      />

      <FileUploadController
        id={degreeAttachmentsField}
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
      <InputController
        id={moreDetailsField}
        textarea
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
  )
}
