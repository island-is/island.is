import {
  FormSystemFormCertificationType,
  FormSystemLanguageType,
} from '@island.is/api/schema'
import {
  Box,
  GridRow,
  ToggleSwitchButton,
  ToggleSwitchCheckbox,
} from '@island.is/island-ui/core'
import { useEffect, useState } from 'react'

interface Props {
  certificationType: FormSystemFormCertificationType
  isSelected: boolean
}

export const CertificationType = ({ certificationType, isSelected }: Props) => {
  const [isSelectedState, setIsSelectedState] = useState(isSelected)

  useEffect(() => {
    setIsSelectedState(isSelected)
  }, [isSelected])

  return (
    <>
      <GridRow>
        <Box marginTop={1}>
          <ToggleSwitchCheckbox
            label={''}
            checked={isSelectedState}
            onChange={(e) => {
              setIsSelectedState(e)
            }}
          />
        </Box>
        <Box marginLeft={2}>
          <h2>{certificationType.name?.is}</h2>
        </Box>
      </GridRow>
      <Box paddingBottom={2}></Box>
    </>
  )
}
