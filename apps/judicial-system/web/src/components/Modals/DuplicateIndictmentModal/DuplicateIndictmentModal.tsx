import { FC, useContext, useState } from 'react'
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
  const { duplicateIndictmentCase } = useCase()
  const [isLoading, setIsLoading] = useState(false)

  const handleDuplicateIndictment = async () => {
    setIsLoading(true)

    const duplicatedCase = await duplicateIndictmentCase(workingCase.id)

    if (!duplicatedCase) {
      setIsLoading(false)
      return
    }

    try {
      await router.push(
        `${PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE}/${duplicatedCase.id}`,
      )
    } catch {
      setIsLoading(false)
    }
  }

  return (
    <Modal
      title="Viltu afrita mál í drög?"
      text="Nýtt mál verður til í drögum. Innihald ákæru ásamt gögnum afritast yfir á nýja málið."
      onClose={onClose}
      loading={isLoading}
      primaryButton={{
        text: 'Afrita mál í drög',
        onClick: handleDuplicateIndictment,
        isLoading,
      }}
      secondaryButton={{
        text: 'Hætta við',
        onClick: onClose,
        isDisabled: isLoading,
      }}
    />
  )
}

export default DuplicateIndictmentModal
