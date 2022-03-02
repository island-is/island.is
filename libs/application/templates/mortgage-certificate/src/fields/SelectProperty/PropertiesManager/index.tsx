import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../../lib/constants'
import { useLocale } from '@island.is/localization'
import { PropertyDetail } from '../../../types/schema'
import { AlertMessage, Divider, Button, Box } from '@island.is/island-ui/core'
import { m } from '../../../lib/messages'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application
  const { id } = field
  const { setValue, getValues } = useFormContext()
  const { formatMessage } = useLocale()
  const [showErrorMsg, setShowErrorMsg] = useState<boolean>(false)
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const myProperties =
    (externalData.nationalRegistryRealEstate?.data as {
      properties: [PropertyDetail]
    })?.properties || []

  const selectedPropertyNumber = getValueViaPath(
    application.answers,
    'selectProperty.propertyNumber',
  ) as string

  const defaultProperty = myProperties[0]

  const handleNext: any = () => {
    submitApplication({
      variables: {
        input: {
          id: application.id,
          event: MCEvents.PENDING,
          // save selected property in answers
          answers: { ...application.answers, ...getValues() },
        },
      },
    }).then(({ data, errors } = {}) => {
      if (data && !errors?.length) {
        // Takes them to the next state (which loads the relevant form)

        refetch?.()
      } else {
        return Promise.reject()
      }
    })
  }
  return (
    <Controller
      name="selectProperty.propertyNumber"
      defaultValue={selectedPropertyNumber || defaultProperty?.propertyNumber}
      render={({ value, onChange }) => {
        return (
          <>
            <RegisteredProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  propertyNumber: p?.propertyNumber,
                  isFromSearch: false,
                })
              }}
              selectedPropertyNumber={value}
            />
            <SearchProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  propertyNumber: p?.propertyNumber,
                  isFromSearch: true,
                })
              }}
              selectedPropertyNumber={value}
            />
            <Box paddingBottom={5}>
              {showErrorMsg && (
                <AlertMessage
                  type="error"
                  title={formatMessage(m.errorSheriffApiTitle)}
                  message={formatMessage(m.errorSheriffApiMessage)}
                />
              )}
            </Box>
            <Divider />
            <Box
              paddingTop={5}
              paddingBottom={5}
              justifyContent="flexEnd"
              display="flex"
            >
              <Button onClick={(e: any) => handleNext(e)} icon="arrowForward">
                {formatMessage(m.continue)}
              </Button>
            </Box>
          </>
        )
      }}
    />
  )
}
