import { FileUpload } from '../FileUpload'
import { Citizenship } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/application/ui-components'
import { supportingDocuments } from '../../lib/messages'
import { useLocale } from '@island.is/localization'

export const CriminalRecords = ({ field, application, error }: any) => {
  const answers = application.answers as Citizenship
  const countryList = answers?.countriesOfResidence?.selectedAbroadCountries

  const filteredCountryList = countryList?.filter(
    (x) => x.wasRemoved === 'false',
  )

  const { formatMessage } = useLocale()

  return (
    <Box>
      {filteredCountryList &&
        filteredCountryList.map((x) => {
          return (
            <FileUploadController
              key={x.country}
              application={application}
              id={`${field.id}.${x.country}`}
              header={`Sakavottorð - ${x.country}`}
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
