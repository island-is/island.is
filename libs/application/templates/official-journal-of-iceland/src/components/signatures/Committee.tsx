import { Box } from '@island.is/island-ui/core'

import * as styles from './Signatures.css'
import { InstitutionSignature } from './Institution'
import {
  DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT,
  SignatureTypes,
} from '../../lib/constants'
import { CommitteeMember } from './CommitteeMember'
import { getValueViaPath } from '@island.is/application/core'
import { useApplication } from '../../hooks/useUpdateApplication'
import { committeeSignatureSchema } from '../../lib/dataSchema'
import { InputFields } from '../../lib/types'
import { getCommitteeSignature } from '../../lib/utils'
import { Chairman } from './Chairman'

type Props = {
  applicationId: string
}

export const CommitteeSignature = ({ applicationId }: Props) => {
  const { application } = useApplication({
    applicationId,
  })

  const getSignature = () => {
    const currentSignature = getValueViaPath(
      application.answers,
      InputFields.signature.committee,
    )

    const parsed = committeeSignatureSchema.safeParse(currentSignature)

    if (parsed.success) {
      return parsed.data
    }

    return getCommitteeSignature(DEFAULT_COMMITTEE_SIGNATURE_MEMBER_COUNT)
  }

  const signature = getSignature()

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
