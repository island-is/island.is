import React, { FC, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import {
  InputController,
  PhoneInputController,
} from '@island.is/shared/form-fields'
import { Box, ResponsiveProp, Space } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { useLazyQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { GET_ELECTRONIC_ID_STATUS } from '../../graphql'
import { isFakePerson } from '../../lib/utils/fakeData'

interface PhoneWithElectronicIdProps {
  field: {
    props: {
      nationalIdPath: string
      marginTop?: ResponsiveProp<Space>
      enabled?: boolean
      defaultValue?: string
    }
  }
}

export const PhoneWithElectronicId: FC<
  React.PropsWithChildren<FieldBaseProps & PhoneWithElectronicIdProps>
> = ({ field, errors }) => {
  console.log('HAVE ERRORS', errors)
  const { formatMessage } = useLocale()
  const { id } = field
  const { nationalIdPath } = field.props
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const { watch, setValue } = useFormContext()
  const nationalId: string = watch(nationalIdPath)
  const [loading, setLoading] = useState(false)

  const [getElectronicIdStatus] = useLazyQuery(GET_ELECTRONIC_ID_STATUS)
  const parentId = id.split('.').slice(0, -1).join('.')

  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    const cleanNationalId = nationalId
      ?.replace(/^\+354/, '')
      .replace(/^00354/, '')
      .replace(/\D/g, '')

    console.log({
      cleanPhone,
      cleanNationalId,
    })

    if (cleanPhone.length === 7 && cleanNationalId?.length === 10) {
      console.log(`Setting ${parentId}.electronicID`)
      setLoading(true)

      if (isFakePerson(cleanNationalId)) {
        // For fake data
        // Allow electronic ID for phone numbers ending in 9
        if (cleanPhone.slice(-1) === '9') {
          console.log('Fake setting it to true, baby!')
          setValue(`${parentId}.electronicID`, 'true')
        } else {
          console.log('Fake setting it to false, baby!')
          setValue(`${parentId}.electronicID`, '')
        }
        setLoading(false)
        return
      }

      getElectronicIdStatus({
        variables: {
          input: {
            nationalId: cleanNationalId,
            phoneNumber: cleanPhone,
          },
        },
      }).then((res) => {
        console.log('HAVE RES', res)
        if (!res.data?.getSyslumennElectronicIDStatus) {
          console.log('Setting it to untrue, baby!')
          setValue(`${parentId}.electronicID`, '')
        } else {
          console.log('Truth is out there')
          setValue(`${parentId}.electronicID`, 'true')
        }
        setLoading(false)
      })
    }
  }, [phoneNumber, nationalId])

  return (
    <Box marginTop={field?.props?.marginTop ?? 0}>
      <PhoneInputController
        id={`${parentId}.phone`}
        label={formatMessage(m.phone)}
        backgroundColor="blue"
        required
        disableDropdown
        loading={loading}
        disabled={
          field?.props?.enabled === undefined ? false : !field.props.enabled
        }
        defaultValue={field?.props?.defaultValue ?? ''}
        error={
          errors
            ? (console.log(
                `What the heckers is ${parentId}.phone`,
              ) as unknown as 'true') ||
              getErrorViaPath(errors, `${parentId}.phone`)
            : undefined
        }
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <Box hidden={true}>
        <InputController id={`${parentId}.electronicID`} defaultValue={''} />
      </Box>
    </Box>
  )
}
