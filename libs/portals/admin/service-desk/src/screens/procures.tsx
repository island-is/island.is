import { useLocale } from '@island.is/localization'
import { m } from '../lib/messages'
import { IntroHeader } from '@island.is/portals/core'
import React, { useEffect } from 'react'
import {
  Box,
  FilterInput,
  GridContainer,
  GridRow,
  SkeletonLoader,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useNationalId } from '../hooks/useNationalId'
import { Procure, procuresMock } from './mockProcures'

const Procures = () => {
  const {
    nationalId,
    handleInputChange,
    isValid,
    formatNationalId,
  } = useNationalId()
  const [isLoading, setIsLoading] = React.useState(false)
  const [procures, setProcures] = React.useState<Procure[]>(procuresMock)

  useEffect(() => {
    if (nationalId.length === 11) {
      setIsLoading(true)
      setTimeout(() => {
        setProcures(procuresMock)
        setIsLoading(false)
      }, 1000)
    }
  }, [isValid, nationalId.length])

  const { formatMessage } = useLocale()
  return (
    <>
      <IntroHeader
        title={formatMessage(m.procures)}
        intro={formatMessage(m.procuresDescription)}
      />
      <Box display={['inline', 'inline', 'flex']}>
        <FilterInput
          placeholder={formatMessage(m.searchByNationalId)}
          name={'procures-nationalId-input'}
          value={nationalId}
          onChange={(e) => handleInputChange(e)}
          backgroundColor="blue"
        />
      </Box>
      <Box marginTop={[3, 3, 6]}>
        {isLoading ? (
          <SkeletonLoader
            height={60}
            repeat={10}
            space={2}
            borderRadius="large"
          />
        ) : isValid ? (
          <GridContainer>
            <Stack space={3}>
              {procures.map((procure) => (
                <GridRow key={`procure-${procure.nationalId}`}>
                  <Box
                    display={'flex'}
                    borderRadius={'large'}
                    border={'standard'}
                    width={'full'}
                    paddingX={4}
                    paddingY={3}
                    justifyContent={'spaceBetween'}
                    alignItems={'center'}
                  >
                    <Box>
                      <Stack space={1}>
                        <Text variant={'h3'} color={'blue400'}>
                          {procure.name}
                        </Text>
                        <Text variant={'default'}>
                          {formatNationalId(procure.nationalId)}
                        </Text>
                      </Stack>
                    </Box>
                  </Box>
                </GridRow>
              ))}
            </Stack>
          </GridContainer>
        ) : (
          <Box display="flex" justifyContent="center">
            <Text variant="h4">
              {formatMessage(m.pleaseEnterValueToBeingSearch)}
            </Text>
          </Box>
        )}
      </Box>
    </>
  )
}

export default Procures
