import React, { useState } from 'react'
import { Box, Select, Button } from '@island.is/island-ui/core'
import {
  ReactSelectOption,
  UpdateAdmin,
} from '@island.is/financial-aid/shared/lib'
import { ValueType } from 'react-select'

import { useStaff } from '@island.is/financial-aid-web/veita/src/utils/useStaff'
import { useRouter } from 'next/router'

import * as styles from './MultiSelection.css'

interface Props {
  admins: UpdateAdmin[]
  onUpdate: () => void
}

const MultiSelectionAdmin = ({ admins, onUpdate }: Props) => {
  const router = useRouter()
  const [selected, setSelected] = useState<UpdateAdmin>()

  const { updateInfo } = useStaff()
  const onSubmitUpdate = async () => {
    const newMuni = router?.query?.id?.toString()

    if (!selected && !newMuni) {
      return
    }
    await updateInfo(
      selected?.id,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      selected?.municipalityIds && newMuni
        ? [...selected?.municipalityIds, newMuni]
        : undefined,
    ).then(() => {
      onUpdate()
    })
  }
  return (
    <Box marginBottom={7} className={styles.selectionAdminContainer}>
      <Select
        label="Leita að stjórnanda"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        options={admins.map((el) => {
          return { label: el.name, value: el.id }
        })}
        placeholder="Veldu stjórnanda"
        onChange={(option: ValueType<ReactSelectOption>) => {
          const { value } = option as ReactSelectOption
          setSelected(admins.find((el) => value === el.id))
        }}
        size="sm"
      />
      <Box display="flex" alignItems="center">
        <Button
          size="small"
          icon="add"
          variant="ghost"
          onClick={onSubmitUpdate}
          disabled={!selected}
        >
          Bæta við
        </Button>
      </Box>
    </Box>
  )
}

export default MultiSelectionAdmin
