import React, { useState } from 'react'
import { useRouter } from 'next/router'
import ContentWrapper from './../../../components/Layout/ContentWrapper'
import { AdminTab } from './../../../entities/common/AdminTab'
import { GrantType } from './../../../entities/models/grant-type.model'
import GrantTypeCreateForm from './../../../components/Admin/form/GrantTypeCreateForm'
import { GrantTypeDTO } from './../../../entities/dtos/grant-type.dto'

const Index: React.FC = () => {
  const router = useRouter()

  const handleCancel = () => {
    router.back()
  }

  const handleGrantTypeSaved = (granTypeSaved: GrantType) => {
    if (granTypeSaved.name) router.push(`/admin/?tab=${AdminTab.GrantTypes}`)
  }

  return (
    <ContentWrapper>
      <GrantTypeCreateForm
        handleCancel={handleCancel}
        grantType={new GrantTypeDTO()}
        handleSaveButtonClicked={handleGrantTypeSaved}
      />
    </ContentWrapper>
  )
}
export default Index
