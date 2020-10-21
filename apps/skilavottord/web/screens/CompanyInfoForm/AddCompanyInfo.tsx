import React, { FC } from 'react'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { FormPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import CompanyInfoForm from './companyForm/CompanyInfoForm'

const AddCompanyInfo: FC = () => {
  const {
    t: { companyInfoForm: t },
  } = useI18n()

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
