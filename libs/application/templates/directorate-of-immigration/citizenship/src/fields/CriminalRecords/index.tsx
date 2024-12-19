import { Citizenship } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/application/ui-components'
import { supportingDocuments } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getErrorViaPath, getValueViaPath } from '@island.is/application/core'
import { OptionSetItem } from '@island.is/clients/directorate-of-immigration'
import {
  FieldBaseProps,
  FileUploadField,
  FieldTypes,
  FieldComponents,
} from '@island.is/application/types'
import { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { FILE_TYPES_ALLOWED } from '../../shared'
import { FileUploadFormField } from '@island.is/application/ui-fields'

export const CriminalRecords: FC<FieldBaseProps> = ({
  field,
  application,
  errors,
}) => {
  const { setValue } = useFormContext()

  const answers = application.answers as Citizenship
  const countryList = answers?.countriesOfResidence?.selectedAbroadCountries

  const filteredCountryList = countryList?.filter(
    (x) => x.wasRemoved === 'false',
  )

  const countryOptions = getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as OptionSetItem[]

  const { formatMessage } = useLocale()

  const setCountryId = (countryId: string, index: number) => {
    setValue(`${field.id}[${index}].countryId`, countryId)
  }

  return (
    <Box>
      {filteredCountryList &&
        filteredCountryList.map((x, index) => {
          setCountryId(x.countryId, index)
          const fileUploadField: FileUploadField = {
            ...field,
            type: FieldTypes.FILEUPLOAD,
            component: FieldComponents.FILEUPLOAD,
            id: `${field.id}[${index}].attachment`,
            uploadHeader: `${formatMessage(
              supportingDocuments.labels.otherDocuments.criminalRecord,
            )} - ${
              countryOptions.find((z) => z.id?.toString() === x.countryId)?.name
            }`,
            uploadDescription: formatMessage(
              supportingDocuments.labels.otherDocuments.acceptedFileTypes,
            ),
            uploadButtonLabel: formatMessage(
              supportingDocuments.labels.otherDocuments.buttonText,
            ),
            uploadAccept: FILE_TYPES_ALLOWED,
          }
          return (
            <FileUploadFormField
              key={x.countryId}
              application={application}
              field={fileUploadField}
              error={
                errors &&
                getErrorViaPath(errors, `${field.id}[${index}].attachment`)
              }
            />
          )
        })}
    </Box>
  )
}
