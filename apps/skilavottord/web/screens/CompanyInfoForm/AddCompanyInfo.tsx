import React, { FC, useContext } from 'react'
import { Stack, Text } from '@island.is/island-ui/core'
import { FormPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import CompanyInfoForm from './components/CompanyInfoForm'
import { hasPermission, Role } from '@island.is/skilavottord-web/auth/utils'
import { UserContext } from '@island.is/skilavottord-web/context'
import { NotFound } from '@island.is/skilavottord-web/components'

const AddCompanyInfo: FC = () => {
  const { user } = useContext(UserContext)
  const {
    t: { companyInfoForm: t },
  } = useI18n()

  if (!user) {
    return null
  } else if (!hasPermission('deregisterVehicle', user?.role as Role)) {
    return <NotFound />
  }

  return (
    <FormPageLayout>
      <Stack space={4}>
        <Text variant="h1">{t.addTitle}</Text>
        <CompanyInfoForm type="add" />
      </Stack>
    </FormPageLayout>
  )
}

export default AddCompanyInfo
