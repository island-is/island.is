import { FieldBaseProps } from '@island.is/application/types'
import { FC, useCallback, useEffect, useState } from 'react'
import { Box, Divider } from '@island.is/island-ui/core'
import { ApplicantReview } from '../Review/ApplicantReview'
import { UniversityApplication } from '../../lib/dataSchema'
import { Routes } from '../../lib/constants'
import { ProgramReview } from '../Review/ProgramReview'
import { SchoolCareerReview } from '../Review/SchoolCareerReview'
import { OtherDocumentsReview } from '../Review/OtherDocumentsReview'
import { useLazyApplicationQuery } from '../../hooks/useLazyApplicationQuery'

export const Overview: FC<FieldBaseProps> = ({
  application,
  field,
  goToScreen,
}) => {
  const answers = application.answers as UniversityApplication
  const getApplicationById = useLazyApplicationQuery()
  const getUniversityApplicationCallback = useCallback(
    async ({ id }: { id: string }) => {
      const { data } = await getApplicationById({
        id,
      })
      return data
    },
    [getApplicationById],
  )

  useEffect(() => {
    getUniversityApplicationCallback({ id: application.id }).then(
      (response) => {
        console.log('response', response)
      },
    )
  }, [])

  return (
    <Box>
      <Divider />
      <ProgramReview field={field} application={application} />
      <Divider />
      <ApplicantReview field={field} application={application} />
      <Divider />
      <SchoolCareerReview
        field={field}
        application={application}
        route={Routes.EDUCATIONDETAILS}
        goToScreen={goToScreen}
      />
      <Divider />
      <OtherDocumentsReview
        field={field}
        application={application}
        route={Routes.OTHERDOCUMENTS}
        goToScreen={goToScreen}
      />
    </Box>
  )
}
