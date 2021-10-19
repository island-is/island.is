import React, { useState, useContext } from 'react'
import { Box, ToggleSwitchCheckbox } from '@island.is/island-ui/core'

import { useRouter } from 'next/router'

import useFormNavigation from '@island.is/financial-aid-web/osk/src/utils/hooks/useFormNavigation'

import {
  FamilyStatus,
  isSpouseDataNeeded,
  NavigationProps,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import {
  InRelationshipForm,
  UnknownRelationshipForm,
} from '@island.is/financial-aid-web/osk/src/routes/application/RelationshipStatusForm'

const RelationshipStatusForm = () => {
  const router = useRouter()

  const { form, updateForm } = useContext(FormContext)

  const navigation: NavigationProps = useFormNavigation(
    router.pathname,
  ) as NavigationProps

  const [isMarried, setIsMarried] = useState(
    isSpouseDataNeeded[form?.familyStatus as FamilyStatus],
  )

  return (
    <>
      {isMarried ? (
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
      <Box position="absolute">
        <ToggleSwitchCheckbox
          label={isMarried ? 'Aðili giftur' : 'ekki giftur'}
          checked={isMarried}
          onChange={(newChecked) => {
            setIsMarried(newChecked)

            updateForm({
              ...form,
              familyStatus: newChecked
                ? FamilyStatus.MARRIED
                : FamilyStatus.NOT_INFORMED,
            })
          }}
        />
      </Box>
    </>
  )
}

export default RelationshipStatusForm
