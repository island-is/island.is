import React, { useContext } from 'react'
import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  MartialStatusType,
  martialStatusTypeFromMartialCode,
  NavigationProps,
} from '@island.is/financial-aid/shared/lib'
import {
  InRelationshipForm,
  UnknownRelationshipForm,
} from '@island.is/financial-aid-web/osk/src/routes/application/RelationshipStatusForm'
import { AppContext } from '@island.is/financial-aid-web/osk/src/components/AppProvider/AppProvider'

const RelationshipStatusForm = () => {
  const router = useRouter()

  const { nationalRegistryData } = useContext(AppContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const inRelationship =
    martialStatusTypeFromMartialCode(
      nationalRegistryData?.spouse?.maritalStatus,
    ) === MartialStatusType.MARRIED

  return (
    <>
      {inRelationship ? (
        <InRelationshipForm
          previousUrl={navigation?.prevUrl}
          nextUrl={navigation?.nextUrl}
        />
      ) : (
        <UnknownRelationshipForm
          previousUrl={navigation?.prevUrl}
          nextUrl={navigation?.nextUrl}
        />
      )}
    </>
  )
}

export default RelationshipStatusForm
