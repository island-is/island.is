import { Citizenship } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/application/ui-components'
import { supportingDocuments } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { getValueViaPath } from '@island.is/application/core'
import { Country } from '@island.is/clients/directorate-of-immigration'
import { FieldBaseProps } from '@island.is/application/types'
import { FC } from 'react'

export const CriminalRecords: FC<FieldBaseProps> = ({ field, application }) => {
  const answers = application.answers as Citizenship
  const countryList = answers?.countriesOfResidence?.selectedAbroadCountries

  const filteredCountryList = countryList?.filter(
    (x) => x.wasRemoved === 'false',
  )

  const countryOptions = getValueViaPath(
    application.externalData,
    'countries.data',
    [],
  ) as Country[]

  const { formatMessage } = useLocale()

  return (
    <Box>
      {filteredCountryList &&
        filteredCountryList.map((x) => {
          return (
            <FileUploadController
              key={x.countryId}
              application={application}
              id={`${field.id}.${x.countryId}`}
              header={`Sakavottorð - ${
                countryOptions.filter((z) => z.id === x.countryId)[0]?.name
              }`}
              description={formatMessage(
                supportingDocuments.labels.otherDocuments.acceptedFileTypes,
              )}
              buttonLabel={formatMessage(
                supportingDocuments.labels.otherDocuments.buttonText,
              )}
            />
          )
        })}
    </Box>
  )
}
