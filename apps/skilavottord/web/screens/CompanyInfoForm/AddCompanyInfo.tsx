import React, { FC, useContext } from 'react'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { FormPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import CompanyInfoForm from './companyForm/CompanyInfoForm'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { Unauthorized } from '@island.is/skilavottord-web/components'
import { UserContext } from '@island.is/skilavottord-web/context'

const AddCompanyInfo: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { companyInfoForm: t },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    console.log(user?.role, 'is not allowed to view this page')
    return <Unauthorized />
  }

  return (
    <FormPageLayout>
      <Box>
        <Stack space={4}>
          <Text variant="h1">{t.addTitle}</Text>
          <CompanyInfoForm type="add" />
        </Stack>
      </Box>
    </FormPageLayout>
  )
}

export default AddCompanyInfo
