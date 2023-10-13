import { FieldBaseProps } from '@island.is/application/types'
import { Box, Button, GridColumn, GridRow } from '@island.is/island-ui/core'
import { useLocale } from '@island.is/localization'
import {
  DatePickerController,
  InputController,
} from '@island.is/shared/form-fields'
import { FC, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  information,
  application as applicationMessages,
} from '../../lib/messages'
import { debounce } from 'lodash'
import { getErrorViaPath } from '@island.is/application/core'
import { FileUploadController } from '@island.is/application/ui-components'
import DescriptionText from '../../components/DescriptionText'

interface Props {
  id: string
  index: number
  repeaterField: any
  handleRemove: (index: number) => void
  itemNumber: number
  addDataToEmploymentList: (field: string, value: string, index: number) => void
  showItemTitle: boolean
}

export const RepeatableEmployment: FC<Props & FieldBaseProps> = ({
  id,
  index,
  handleRemove,
  repeaterField,
  itemNumber,
  showItemTitle,
  addDataToEmploymentList,
  ...props
}) => {
  const { setValue } = useFormContext()
  const { formatMessage } = useLocale()
  const { application, errors } = props

  const fieldIndex = `${id}[${index}]`
  const nameField = `${fieldIndex}.name`
  const countryField = `${fieldIndex}.country`
  const dateFromField = `${fieldIndex}.dateFrom`
  const dateToField = `${fieldIndex}.dateTo`
  const applicationFileField = `${fieldIndex}.applicationFile`
  const employmentContractField = `${fieldIndex}.employmentContract`
  const typeOfEmploymentField = `${fieldIndex}.typeOfEmployment`
  const wasRemovedField = `${fieldIndex}.wasRemoved`

  useEffect(() => {
    setValue(wasRemovedField, repeaterField.wasRemoved)
  }, [repeaterField.wasRemoved, setValue])

  return (
    <Box hidden={repeaterField.wasRemoved === 'true'}>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="spaceBetween"
        marginTop={showItemTitle || itemNumber > 0 ? 2 : 0}
      >
        {showItemTitle && (
          <DescriptionText
            text={information.labels.employment.itemTitle}
            format={{ index: itemNumber + 1 }}
            textProps={{
              as: 'h5',
              fontWeight: 'semiBold',
              marginBottom: 0,
            }}
          />
        )}

        {itemNumber > 0 && (
          <Button
            variant="text"
            textSize="sm"
            size="small"
            onClick={() => handleRemove(index)}
          >
            {formatMessage(information.labels.employment.deleteButtonTitle)}
          </Button>
        )}
      </Box>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={nameField}
            label={formatMessage(information.labels.employment.nameInput)}
            backgroundColor="blue"
            onChange={debounce((value) =>
              addDataToEmploymentList(
                'name',
                value.target.value as string,
                index,
              ),
            )}
            error={errors && getErrorViaPath(errors, nameField)}
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <InputController
            id={countryField}
            label={formatMessage(information.labels.employment.countryInput)}
            backgroundColor="blue"
            onChange={debounce((value) =>
              addDataToEmploymentList(
                'country',
                value.target.value as string,
                index,
              ),
            )}
            error={errors && getErrorViaPath(errors, countryField)}
          />
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <DatePickerController
            id={dateFromField}
            backgroundColor="blue"
            label={formatMessage(information.labels.employment.dateFromInput)}
            error={errors && getErrorViaPath(errors, dateFromField)}
            placeholder={formatMessage(
              information.labels.employment.datePlaceholder,
            )}
            onChange={(value) =>
              addDataToEmploymentList('dateFrom', value as string, index)
            }
          />
        </GridColumn>
        <GridColumn span={['1/1', '1/1', '1/2']} paddingTop={2}>
          <DatePickerController
            id={dateToField}
            backgroundColor="blue"
            label={formatMessage(information.labels.employment.dateToInput)}
            error={errors && getErrorViaPath(errors, dateToField)}
            placeholder={formatMessage(
              information.labels.employment.datePlaceholder,
            )}
            onChange={(value) =>
              addDataToEmploymentList('dateTo', value as string, index)
            }
          />
        </GridColumn>
      </GridRow>
      <Box marginTop={4}>
        <FileUploadController
          key={applicationFileField}
          application={application}
          id={applicationFileField}
          header={formatMessage(
            information.labels.employment.applicationFileHeader,
          )}
          description={formatMessage(applicationMessages.acceptedFileTypes)}
          buttonLabel={formatMessage(applicationMessages.uploadFileButtonText)}
        />
      </Box>
      <Box marginTop={2}>
        <FileUploadController
          key={employmentContractField}
          application={application}
          id={employmentContractField}
          header={formatMessage(
            information.labels.employment.contractFileHeader,
          )}
          description={formatMessage(applicationMessages.acceptedFileTypes)}
          buttonLabel={formatMessage(applicationMessages.uploadFileButtonText)}
        />
      </Box>
    </Box>
  )
}
