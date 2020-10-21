import React, { useEffect } from 'react'
import { Box, Stack, Text } from '@island.is/island-ui/core'
import { FormPageLayout } from '@island.is/skilavottord-web/components/Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import { useRouter } from 'next/router'
import CompanyInfoForm from './companyForm/CompanyInfoForm'

const EditCompanyInfo = ({ apolloState }) => {
  const {
    t: { companyInfoForm: t, routes },
  } = useI18n()

  const router = useRouter()
  const { id } = router.query

  const companyInfo = apolloState[`RecyclingPartner:${id}`]

  useEffect(() => {
    if (!companyInfo) {
      router.replace(routes.companyInfo.baseRoute)
    }
  }, [companyInfo])

  return (
    <>
      {companyInfo && (
        <FormPageLayout>
          <Box>
            <Stack space={4}>
              <Text variant="h1">{t.editTitle}</Text>
              <CompanyInfoForm type="edit" initialValues={companyInfo} />
            </Stack>
          </Box>
        </FormPageLayout>
      )}
    </>
  )
}

export default EditCompanyInfo
