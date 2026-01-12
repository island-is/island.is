import React, { Dispatch, SetStateAction, useContext } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import { isDistrictCourtUser } from '@island.is/judicial-system/types'
import {
  InputAdvocate,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  Case,
  RequestSharedWhen,
  Victim,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { useVictim } from '@island.is/judicial-system-web/src/utils/hooks'

export const LegalRightsProtectorInputFields = ({
  victim,
  workingCase,
  setWorkingCase,
  useVictimNameAsTitle,
}: {
  victim: Victim
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
  useVictimNameAsTitle?: boolean
}) => {
  const { updateVictimAndSetState, updateVictimState, updateVictim } =
    useVictim()
  const { user } = useContext(UserContext)

  return (
    <>
      <Box marginBottom={2}>
        <Text as="h3" variant="h4">
          {useVictimNameAsTitle ? victim.name : 'Réttargæslumaður'}
        </Text>
      </Box>
      <InputAdvocate
        advocateType="legalRightsProtector"
        name={victim.lawyerName}
        email={victim.lawyerEmail}
        phoneNumber={victim.lawyerPhoneNumber}
        onAdvocateChange={(
          lawyerName,
          lawyerNationalId,
          lawyerEmail,
          lawyerPhoneNumber,
        ) =>
          updateVictimAndSetState(
            {
              caseId: workingCase.id,
              victimId: victim.id,
              lawyerName,
              lawyerNationalId,
              lawyerEmail,
              lawyerPhoneNumber,
              // if court makes any lawyer changes we default to not sharing the request
              ...(isDistrictCourtUser(user)
                ? {
                    lawyerAccessToRequest: RequestSharedWhen.OBLIGATED,
                  }
                : {}),
            },
            setWorkingCase,
          )
        }
        onEmailChange={(lawyerEmail) =>
          updateVictimState(
            {
              caseId: workingCase.id,
              victimId: victim.id,
              lawyerEmail,
            },
            setWorkingCase,
          )
        }
        onEmailSave={(lawyerEmail) =>
          updateVictim({
            caseId: workingCase.id,
            victimId: victim.id,
            lawyerEmail,
          })
        }
        onPhoneNumberChange={(lawyerPhoneNumber) =>
          updateVictimState(
            {
              caseId: workingCase.id,
              victimId: victim.id,
              lawyerPhoneNumber,
            },
            setWorkingCase,
          )
        }
        onPhoneNumberSave={(lawyerPhoneNumber) =>
          updateVictim({
            caseId: workingCase.id,
            victimId: victim.id,
            lawyerPhoneNumber,
          })
        }
      />
    </>
  )
}
