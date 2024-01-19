import { FieldBaseProps, YES } from '@island.is/application/types'
import { FC } from 'react'
import { Box, GridColumn, GridRow } from '@island.is/island-ui/core'
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

interface DetailsRepeaterItemProps extends FieldBaseProps {
  index: number
}

export const DetailsRepeaterItem: FC<DetailsRepeaterItemProps> = ({
  application,
  field,
  goToScreen,
  index,
}) => {
  const { formatMessage } = useLocale()
  const countries = getAllCountryCodes()
  return (
    <Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={`${Routes.EDUCATIONDETAILS}[${index}].school`}
            label={formatMessage(
              formerEducation.labels.educationDetails.schoolLabel,
            )}
            backgroundColor="blue"
            required
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <SelectController
            id={`${Routes.EDUCATIONDETAILS}[${index}].degreeLevel`}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeLevelLabel,
            )}
            backgroundColor="blue"
            required
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
            id={`${Routes.EDUCATIONDETAILS}[${index}].degreeMajor`}
            label={formatMessage(
              formerEducation.labels.educationDetails.degreeMajorLabel,
            )}
            backgroundColor="blue"
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={`${Routes.EDUCATIONDETAILS}[${index}].finishedUnits`}
            type="number"
            label={formatMessage(
              formerEducation.labels.educationDetails.finishedUnitsLabel,
            )}
            backgroundColor="blue"
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={`${Routes.EDUCATIONDETAILS}[${index}].averageGrade`}
            type="number"
            label={formatMessage(
              formerEducation.labels.educationDetails.averageGradeLabel,
            )}
            backgroundColor="blue"
          />
        </GridColumn>

        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <SelectController
            id={`${Routes.EDUCATIONDETAILS}[${index}].degreeCountry`}
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
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <DatePickerController
            id={`${Routes.EDUCATIONDETAILS}[${index}].beginningDate`}
            required
            label={formatMessage(
              formerEducation.labels.educationDetails.beginningDateLabel,
            )}
            backgroundColor="blue"
          />
        </GridColumn>

        <GridColumn
          span={['1/1', '1/1', '1/2']}
          paddingTop={2}
          paddingBottom={2}
        >
          <DatePickerController
            id={`${Routes.EDUCATIONDETAILS}[${index}].endDate`}
            required
            label={formatMessage(
              formerEducation.labels.educationDetails.endDateLabel,
            )}
            backgroundColor="blue"
          />
        </GridColumn>
      </GridRow>
      <CheckboxController
        id={`${Routes.EDUCATIONDETAILS}[${index}].degreeFinished`}
        backgroundColor="blue"
        large
        spacing={2}
        options={[
          {
            label: formatMessage(
              formerEducation.labels.educationDetails
                .degreeFinishedCheckboxLabel,
            ), // TODO Check if this works without formatMessage
            value: YES,
          },
        ]}
      />

      <FileUploadController
        id={`${Routes.EDUCATIONDETAILS}[${index}].degreeAttachments`}
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
    </Box>
  )
}
