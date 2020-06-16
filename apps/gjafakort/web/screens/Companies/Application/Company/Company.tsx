import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { ApplicationStates } from '@island.is/gjafakort/consts'
import { ContentLoader } from '@island.is/gjafakort-web/components'
import { Signup, Congratulations, NotQualified } from './components'

export const CompanyQuery = gql`
  query CompanyQuery($ssn: String!) {
    company(ssn: $ssn) {
      ssn
      name
      application {
        id
        name
        email
        state
        companySSN
        serviceCategory
        generalEmail
        webpage
        phoneNumber
        companyName
        companyDisplayName
      }
    }
  }
`

function Company() {
  const router = useRouter()
  const { ssn } = router.query
  const [submission, setSubmission] = useState<
    'pending' | 'rejected' | 'approved'
  >(ApplicationStates.PENDING)
  const { data, loading } = useQuery(CompanyQuery, { variables: { ssn } })
  const { company } = data || {}

  const onSubmit = (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmission(ApplicationStates.APPROVED)
    } else {
      setSubmission(ApplicationStates.REJECTED)
    }
  }

  if (loading && !data) {
    return <ContentLoader />
  }

  if (
    company.application?.state === ApplicationStates.REJECTED ||
    submission === ApplicationStates.REJECTED
  ) {
    return <NotQualified />
  } else if (
    company.application?.id ||
    submission === ApplicationStates.APPROVED
  ) {
    return <Congratulations />
  }

  return <Signup company={company} handleSubmission={onSubmit} />
}

export default Company
