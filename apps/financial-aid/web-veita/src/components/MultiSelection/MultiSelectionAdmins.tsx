import React, { useState } from 'react'
import { Box, Select, Button } from '@island.is/island-ui/core'
import { ReactSelectOption } from '@island.is/financial-aid/shared/lib'
import { ValueType } from 'react-select'

import { useStaff } from '../../utils/useStaff'
import { useRouter } from 'next/router'

interface UpdateAdmin {
  id: string
  name: string
  municipalityIds: string[]
}

interface Props {
  admins: UpdateAdmin[]
}

const MultiSelectionAdmin = ({ admins }: Props) => {
  const router = useRouter()
  const [selected, setSelected] = useState<UpdateAdmin>()
  console.log(selected)

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
    )
  }

  console.log(admins)
  return (
    <Box display="block" marginBottom={3}>
      <Box marginBottom={3}>
        <Button
          size="small"
          icon="add"
          variant="ghost"
          onClick={onSubmitUpdate}
        >
          Bæta við stjórnanda
        </Button>
      </Box>

      <Select
        label="Stjórnendur"
        name="selectMunicipality"
        noOptionsMessage="Enginn valmöguleiki"
        options={admins.map((el) => {
          return { label: el.name, value: el.id }
        })}
        placeholder="Leita að stjórnanda"
        onChange={(option: ValueType<ReactSelectOption>) => {
          const { value } = option as ReactSelectOption
          setSelected(admins.find((el) => value === el.id))
        }}
        errorMessage="Verður að velja að minnsta kosti 1 sveitarfélag"
        // hasError={hasError && municipalityIds.length === 0}
      />
    </Box>
  )
}

export default MultiSelectionAdmin
