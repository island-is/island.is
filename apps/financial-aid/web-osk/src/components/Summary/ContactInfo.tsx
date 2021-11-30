import React from 'react'
import { Box, Button, Divider, Text } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import * as styles from './summary.css'
import { Routes } from '@island.is/financial-aid/shared/lib'

interface Props {
  error: boolean
  phone?: string
  email?: string
}

const ContactInfo = ({ error, phone, email }: Props) => {
  const router = useRouter()

  const emailError = error && email === undefined
  const phoneError = error && phone === undefined
  return (
    <>
      <Divider />

      <Box
        paddingY={[4, 4, 5]}
        className={styles.userInfoContainer}
        id="contactInfo"
      >
        <Box className={styles.mainInfo}>
          <Text fontWeight="semiBold" color={emailError ? 'red600' : 'dark400'}>
            Netfang
            {emailError && '*'}
          </Text>
          <Text>{email}</Text>
        </Box>
        <Box className={styles.contactInfo}>
          <Text fontWeight="semiBold" color={phoneError ? 'red600' : 'dark400'}>
            Símanúmer
            {phoneError && '*'}
          </Text>
          <Text>{phone}</Text>
        </Box>

        <Box>
          <Button
            icon="pencil"
            iconType="filled"
            variant="utility"
            onClick={() => {
              router.push(Routes.form.contactInfo)
            }}
          >
            Breyta
          </Button>
        </Box>
      </Box>
    </>
  )
}

export default ContactInfo
