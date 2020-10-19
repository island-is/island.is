import React, { FC, useState } from 'react'
import { useRouter } from 'next/router'
import { ProcessPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import {
  Box,
  Button,
  Hidden,
  Input,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useI18n } from '@island.is/skilavottord-web/i18n'

const Select: FC = () => {
  const {
    t: {
      deregisterVehicle: { select: t },
      routes: { deregisterVehicle: routes },
    },
  } = useI18n()
  const router = useRouter()
  const [registrationNumber, setRegistrationNumber] = useState('')

  const handleInputChange = (value: string) => {
    if (value.length <= 6) {
      setRegistrationNumber(value)
    }
  }

  const handleContinue = () => {
    router.push(routes.deregister, `${routes.baseRoute}/${registrationNumber}`)
  }

  const handleCancel = () => {
    router.push(routes.baseRoute)
  }

  return (
    <ProcessPageLayout sectionType={'company'} activeSection={0}>
      <Stack space={4}>
        <Text variant="h1">{t.title}</Text>
        <Text variant="intro">{t.info}</Text>
        <Input
          label={t.input.label}
          placeholder={t.input.placeholder}
          name="registrationNumber"
          value={registrationNumber}
          onChange={({ target }) => handleInputChange(target.value)}
          required
        />
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Hidden above="md">
            <Button variant="ghost" circle size="large" icon="arrowBack" />
          </Hidden>
          <Hidden below="md">
            <Button variant="ghost" onClick={handleCancel}>
              {t.buttons.cancel}
            </Button>
          </Hidden>
          <Button
            icon="arrowBack"
            disabled={!registrationNumber}
            onClick={handleContinue}
          >
            {t.buttons.continue}
          </Button>
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}

export default Select
