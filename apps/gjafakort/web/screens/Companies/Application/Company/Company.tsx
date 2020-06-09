import React, { useState } from 'react'
import { useQuery } from 'react-apollo'
import { useRouter } from 'next/router'
import gql from 'graphql-tag'

import { ContentLoader } from '@island.is/gjafakort-web/components'
import { Signup, Congratulations, NotQualified } from './components'

export const GetCompanyQuery = gql`
  query GetCompanyQuery($ssn: String!) {
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
  >('pending')
  const { data, loading } = useQuery(GetCompanyQuery, { variables: { ssn } })
  const { company } = data || {}

  const onSubmit = (isSuccess: boolean) => {
    if (isSuccess) {
      setSubmission('approved')
    } else {
      setSubmission('rejected')
    }
  }

  if (loading && !data) {
    return <ContentLoader />
  }

  if (company.application?.state === 'rejected' || submission === 'rejected') {
    return <NotQualified />
  } else if (company.application?.id || submission === 'approved') {
    return <Congratulations />
  }

  return <Signup company={company} handleSubmission={onSubmit} />
}

export default Company
