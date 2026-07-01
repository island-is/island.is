import { FC, useContext } from 'react'
import { useRouter } from 'next/router'

import { PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE } from '@island.is/judicial-system/consts'
import {
  FormContext,
  Modal,
} from '@island.is/judicial-system-web/src/components'
import { useCase } from '@island.is/judicial-system-web/src/utils/hooks'

interface Props {
  onClose: () => void
}

const DuplicateIndictmentModal: FC<Props> = ({ onClose }) => {
  const { workingCase } = useContext(FormContext)
  const router = useRouter()
  const { duplicateIndictmentCase, isDuplicatingIndictmentCase } = useCase()

  const handleDuplicateIndictment = async () => {
    const duplicatedCase = await duplicateIndictmentCase(workingCase.id)

    if (duplicatedCase) {
      router.push(
        `${PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE}/${duplicatedCase.id}`,
      )
    }
  }

  return (
    <Modal
      title="Viltu afrita mál í drög?"
      text="Nýtt mál verður til í drögum. Innihald ákæru ásamt gögnum afritast yfir á nýja málið."
      onClose={onClose}
      primaryButton={{
        text: 'Afrita mál í drög',
        onClick: handleDuplicateIndictment,
        isLoading: isDuplicatingIndictmentCase,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: onClose,
        isDisabled: isDuplicatingIndictmentCase,
      }}
    />
  )
}

export default DuplicateIndictmentModal
