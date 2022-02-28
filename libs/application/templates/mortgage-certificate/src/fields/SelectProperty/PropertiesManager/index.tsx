import React, { FC, useState } from 'react'
import { useMutation } from '@apollo/client'
import { Controller, useFormContext } from 'react-hook-form'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { RegisteredProperties } from '../RegisteredProperties'
import { SearchProperties } from '../SearchProperties'
import { SUBMIT_APPLICATION } from '@island.is/application/graphql'
import { MCEvents } from '../../../lib/constants'
import {
  PropertyOverviewWithDetail,
  PropertyDetail,
} from '../../../types/schema'
import { AlertMessage, Divider, Button, Box } from '@island.is/island-ui/core'

export const PropertiesManager: FC<FieldBaseProps> = ({
  application,
  field,
  refetch,
}) => {
  const { externalData } = application
  const { id } = field
  const { setValue, getValues } = useFormContext()

  const [errorMsg, setErrorMsg] = useState<string>('Villa hefur komið upp')
  const [submitApplication] = useMutation(SUBMIT_APPLICATION, {
    onError: (e) => console.error(e.message),
  })

  const myProperties =
    (externalData.nationalRegistryRealEstate
      ?.data as PropertyOverviewWithDetail).properties || []

  //TODOx find better solution (need to get rid of __typename field to continue to next step)
  const getCleanValue: any = (p: PropertyDetail) => {
    return {
      propertyNumber: p?.propertyNumber,
      defaultAddress: {
        display: p?.defaultAddress?.display,
      },
      unitsOfUse: {
        unitsOfUse: [
          {
            marking: (p?.unitsOfUse?.unitsOfUse || [])[0]?.marking,
            displaySize: (p?.unitsOfUse?.unitsOfUse || [])[0]?.displaySize,
            buildYearDisplay: (p?.unitsOfUse?.unitsOfUse || [])[0]
              ?.buildYearDisplay,
            explanation: (p?.unitsOfUse?.unitsOfUse || [])[0]?.explanation,
          },
        ],
      },
    }
  }

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

  const selectedPropertyNumber = getValueViaPath(
    application.answers,
    'selectProperty.property.propertyNumber',
  ) as string

  return (
    <Controller
      name="selectProperty.property.propertyNumber"
      defaultValue={selectedPropertyNumber || myProperties[0]?.propertyNumber}
      render={({ value, onChange }) => {
        return (
          <>
            <RegisteredProperties
              application={application}
              field={field}
              selectHandler={(p: PropertyDetail | undefined) => {
                onChange(p?.propertyNumber)
                setValue(id, {
                  property: getCleanValue(p),
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
                  property: getCleanValue(p),
                  isFromSearch: true,
                })
              }}
              selectedPropertyNumber={value}
            />
            <Box paddingBottom={5}>
              {errorMsg.length > 0 && (
                <AlertMessage
                  type="error"
                  title="Villa hefur komið upp á milli ísland.is og sýslumanna"
                  message="Vinsamlega reyndu aftur síðar."
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
                Áfram
              </Button>
            </Box>
          </>
        )
      }}
    />
  )
}
