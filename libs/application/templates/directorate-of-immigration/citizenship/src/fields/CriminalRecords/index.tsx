import { FileUpload } from '../FileUpload'
import { Citizenship } from '../../lib/dataSchema'
import { Box } from '@island.is/island-ui/core'
import { FileUploadController } from '@island.is/application/ui-components'

export const CriminalRecords = ({ field, application, error }: any) => {
  const answers = application.answers as Citizenship
  const countryList = answers?.countriesOfResidence?.selectedAbroadCountries

  console.log('countrylist', countryList)

  return (
    <Box>
      {countryList &&
        countryList.map((x) => {
          return (
            <FileUploadController
              application={application}
              id={`${field.id}.${x.country}`}
              header={`Sakavottorð - ${x.country}`}
            />
          )
        })}
    </Box>
  )
}
