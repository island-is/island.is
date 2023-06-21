import React from 'react'
import { FileUpload } from '../FileUpload'
import { Citizenship } from '../../lib/dataSchema'

export const CriminalRecords = ({ field, application, error }: any) => {
  const answers = application.answers as Citizenship
  const countryList = answers?.countriesOfResidence?.selectedAbroadCountries

  return (
    countryList ?
    (
      countryList.map((x) => {
      return (
        <FileUpload
          field={{
            id: `${field.id}.${x.country}`,
            props: {
              fieldTitle: `Sakavottorð - ${x.country}`,
            },
          }}
          application={application}
        />
      )
    })
    ) : (
      <div></div>
    )
  )
}
