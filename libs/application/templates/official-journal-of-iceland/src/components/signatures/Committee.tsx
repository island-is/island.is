import { Box } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InstitutionSignature } from './Institution'
import { SignatureTypes } from '../../lib/constants'
import { CommitteeMember } from './CommitteeMember'
import { useApplication } from '../../hooks/useUpdateApplication'
import { isCommitteeSignature } from '../../lib/utils'
import { Chairman } from './Chairman'
import { getValueViaPath } from '@island.is/application/core'
import { InputFields } from '../../lib/types'

type Props = {
  applicationId: string
}

export const CommitteeSignature = ({ applicationId }: Props) => {
  const { application } = useApplication({
    applicationId,
  })

  const getSignature = () => {
    const currentAnswers = getValueViaPath(
      application.answers,
      InputFields.signature.committee,
    )

    if (isCommitteeSignature(currentAnswers)) {
      return currentAnswers
    }
  }

  const signature = getSignature()

  if (!signature) {
    return null
  }

  return (
    <Box className={styles.signatureWrapper}>
      <InstitutionSignature
        applicationId={applicationId}
        type={SignatureTypes.COMMITTEE}
      />
      <Box className={styles.wrapper}>
        <Chairman applicationId={applicationId} member={signature.chairman} />
        {signature?.members?.map((member, index) => (
          <CommitteeMember
            key={index}
            applicationId={applicationId}
            memberIndex={index}
            member={member}
          />
        ))}
      </Box>
    </Box>
  )
}
