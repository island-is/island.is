import { useContext, useState } from 'react'

import { Box, Select, Text } from '@island.is/island-ui/core'
import { capitalize } from '@island.is/judicial-system/formatters'
import {
  FormContentContainer,
  FormFooter,
  PageTitle,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import { api } from '@island.is/judicial-system-web/src/services'

import * as styles from './SelectUser.css'

const SelectUser = () => {
  const [userId, setUserId] = useState<string>()

  const { eligibleUsers } = useContext(UserContext)

  const eligibleInstitutions = eligibleUsers?.map((user) => ({
    label: `${user.institution?.name} - ${capitalize(user.title)}`,
    value: user.id,
  }))

  return (
    <>
      <FormContentContainer>
        <Box className={styles.titleContainer}>
          <PageTitle marginBottom={0}>Veldu embætti og hlutverk</PageTitle>
        </Box>
        <Box className={styles.subTitleContainer} marginBottom={4}>
          <Text as="h2" variant="h2">
            Þú hefur aðgang að eftirfarandi hlutverkum
          </Text>
        </Box>
        <Select
          label="Embætti"
          placeholder="Veldu embætti"
          options={eligibleInstitutions}
          onChange={(value) => setUserId(value?.value)}
        />
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          hidePreviousButton
          nextButtonIcon="arrowForward"
          nextButtonText="Halda áfram"
          nextIsDisabled={!userId}
          onNextButtonClick={() => userId && api.activate(userId)}
        />
      </FormContentContainer>
    </>
  )
}

export default SelectUser
