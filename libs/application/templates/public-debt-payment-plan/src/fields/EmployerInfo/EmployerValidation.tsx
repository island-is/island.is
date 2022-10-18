import { FieldBaseProps } from '@island.is/application/types'
import { gql, useQuery } from '@apollo/client'
import { Box } from '@island.is/island-ui/core'
import React, { FC, useEffect, useState } from 'react'

const GET_EMPLOYER_VALID = gql`
  query isEmployerValid($input: GetIsEmployerValidInput!) {
    isEmployerValid(input: $input)
  }
`

export const EmployerValidation: FC<FieldBaseProps> = ({
  application,
  goToScreen,
}) => {
  const [loaded, setLoaded] = useState<boolean>(false)
  const { loading, error, data, refetch } = useQuery(GET_EMPLOYER_VALID, {
    // invalid 5902697199
    // invalid 6911160180
    // valid 5407141260
    variables: { input: { companyId: '6911160180' } },
  })

  console.log('VALIDATION')

  useEffect(() => {
    if (loading || error) {
      return
    }
    if (loaded) {
      setLoaded(false)
      refetch()
    }
    setLoaded(true)
    console.log(application)
    const isValid = data?.isEmployerValid === false
    if (isValid && goToScreen) {
      goToScreen('disposableIncome')
    }
    if (!isValid && goToScreen) {
      goToScreen('employerMultiField')
    }
  }, [loading])

  return loading ? <Box>loading</Box> : <Box>{loading}</Box>
}
