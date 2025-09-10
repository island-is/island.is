import React, { FC, useEffect, useState } from 'react'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'
import { PhoneInputController } from '@island.is/shared/form-fields'
import { Box } from '@island.is/island-ui/core'
import { FieldBaseProps } from '@island.is/application/types'
import { getErrorViaPath } from '@island.is/application/core'
import { useLazyQuery } from '@apollo/client'
import { useFormContext } from 'react-hook-form'
import { fakeDataIsEnabled } from '../../lib/utils'
import { GET_SYSLUMENN_ELECTRONIC_ID_STATUS } from '../../queries'

interface PhoneWithElectronicIdProps {
  field: {
    props: { nationalIdPath: string }
  }
}

export const PhoneWithElectronicId: FC<
  React.PropsWithChildren<FieldBaseProps & PhoneWithElectronicIdProps>
> = ({ application: { answers }, field, errors }) => {
  const { formatMessage } = useLocale()
  const { id } = field
  const { nationalIdPath } = field.props
  const [phoneNumber, setPhoneNumber] = useState<string>('')
  const { watch, setValue } = useFormContext()
  const nationalId: string = watch(nationalIdPath)
  const [loading, setLoading] = useState(false)

  const [getElectronicIdStatus] = useLazyQuery(
    GET_SYSLUMENN_ELECTRONIC_ID_STATUS,
  )
  const topId = id.split('.')[0]

  useEffect(() => {
    const cleanPhone = phoneNumber.replace(/\D/g, '')
    if (cleanPhone.length === 7 && nationalId?.length === 10) {
      setLoading(true)

      if (fakeDataIsEnabled(answers)) {
        // For fake data
        // Allow electronic ID for phone numbers ending in 9
        if (cleanPhone.slice(-1) === '9') {
          setValue(`${topId}.electronicID`, 'true')
        } else {
          setValue(`${topId}.electronicID`, '')
        }
        setLoading(false)
        return
      }

      getElectronicIdStatus({
        variables: {
          input: {
            nationalId,
            phoneNumber: cleanPhone,
          },
        },
      }).then((res) => {
        if (!res.data?.getSyslumennElectronicIDStatus) {
          setValue(`${topId}.electronicID`, '')
        } else {
          setValue(`${topId}.electronicID`, 'true')
        }
        setLoading(false)
      })
    }
  }, [phoneNumber, nationalId, answers, getElectronicIdStatus, setValue, topId])

  return (
    <Box marginTop={2}>
      <PhoneInputController
        id={id}
        label={formatMessage(m.phone)}
        backgroundColor="blue"
        required
        disableDropdown
        loading={loading}
        error={errors ? getErrorViaPath(errors, id) : undefined}
        onChange={(e) => setPhoneNumber(e.target.value)}
        defaultValue=""
      />
    </Box>
  )
}
