import { Box } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InputFields } from '../../lib/types'
import { useApplication } from '../../hooks/useUpdateApplication'
import { getValueViaPath } from '@island.is/application/core'
import { InstitutionSignature } from './Institution'
import { RegularMember } from './RegularMember'
import { isRegularSignature } from '../../lib/utils'
import { AddRegularMember } from './AddRegularMember'
import { AddRegularSignature } from './AddRegularSignature'
import { AdditionalSignature } from './Additional'

type Props = {
  applicationId: string
}

export const RegularSignature = ({ applicationId }: Props) => {
  const { application } = useApplication({
    applicationId,
  })

  const getSignature = () => {
    const currentAnswers = getValueViaPath(
      application.answers,
      InputFields.signature.regular,
    )

    if (isRegularSignature(currentAnswers)) {
      return currentAnswers
    }
  }

  const signature = getSignature()

  if (!signature) {
    return null
  }

  return (
    <>
      {signature?.map((signature, index) => {
        return (
          <Box key={index} className={styles.signatureWrapper}>
            <InstitutionSignature
              applicationId={applicationId}
              type="regular"
              signatureIndex={index}
            />
            <Box className={styles.wrapper}>
              {signature.members?.map((_, memberIndex) => {
                const member = signature.members?.at(memberIndex)
                return (
                  <RegularMember
                    key={`signature.${index}.member.${memberIndex}`}
                    applicationId={applicationId}
                    signatureIndex={index}
                    memberIndex={memberIndex}
                    member={member}
                  />
                )
              })}
              <AddRegularMember
                applicationId={applicationId}
                signatureIndex={index}
              />
            </Box>
          </Box>
        )
      })}
      <AddRegularSignature applicationId={applicationId} />
      <AdditionalSignature
        applicationId={applicationId}
        name={InputFields.signature.additionalSignature.regular}
      />
    </>
  )
}
