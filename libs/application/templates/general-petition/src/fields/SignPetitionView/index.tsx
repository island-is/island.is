import { FC, useEffect, useState } from 'react'
import { FieldBaseProps, YES } from '@island.is/application/types'
import {
  Text,
  Box,
  Button,
  Input,
  toast,
  Stack,
} from '@island.is/island-ui/core'
import { m } from '../../lib/messages'
import { useLocale } from '@island.is/localization'
import { CheckboxController } from '@island.is/shared/form-fields'
import { useMutation, useQuery } from '@apollo/client'
import { useHasEndorsed } from '../../hooks/useHasEndorsed'
import { useGetSinglePetitionList } from '../../hooks/useGetSinglePetitionList'
import { GetFullName } from '../../graphql/queries'
import { EndorseList } from '../../graphql/mutations'
import format from 'date-fns/format'
import { EndorsementList } from '../../types/schema'
import Skeleton from './Skeleton'
import School from '../../assets/School'
import { useNavigate } from 'react-router-dom'

const SignPetitionView: FC<FieldBaseProps> = ({ application }) => {
  const { formatMessage } = useLocale()
  const navigate = useNavigate()

  const endorsementListId = (application.externalData?.createEndorsementList
    .data as any).id
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [showName, setShowName] = useState(true)

  const checkForSigned = useHasEndorsed(endorsementListId)
  const [hasSigned, setHasSigned] = useState(checkForSigned)

  const { petitionData } = useGetSinglePetitionList(endorsementListId)
  const petitionList = petitionData as EndorsementList
  const listClosed = new Date() >= new Date(petitionList.closedDate)
  const [createEndorsement, { loading: submitLoad }] = useMutation(EndorseList)
  const { data: userData } = useQuery(GetFullName)

  useEffect(() => setHasSigned(checkForSigned), [checkForSigned])

  const signPetition = async () => {
    const success = await createEndorsement({
      variables: {
        input: {
          listId: endorsementListId,
          endorsementDto: {
            showName: showName,
          },
        },
      },
    }).catch(() => {
      toast.error(formatMessage(m.toastError))
    })

    if (success) {
      setHasSigned(true)
    }
  }

  return (
    <Box>
      {hasSigned ? (
        <Box>
          <Text marginBottom={2} variant="h2">
            {formatMessage(m.petitionSigned)}
          </Text>

          <Box paddingTop={5} display="flex" justifyContent="center">
            <School />
          </Box>
          <Box position="absolute" bottom={0} right={0}>
            <Button
              icon="arrowForward"
              onClick={() => navigate('/../minarsidur/umsoknir')}
            >
              {formatMessage(m.backtoSP)}
            </Button>
          </Box>
        </Box>
      ) : (
        <Box>
          {Object.entries(petitionList).length > 0 ? (
            <Stack space={5}>
              <Box>
                <Text variant="h2" marginBottom={2}>
                  {petitionList?.title}
                </Text>
                <Text>{petitionList?.description}</Text>
              </Box>

              <Box display={'flex'}>
                <Box width="half">
                  <Text variant="h4">{formatMessage(m.listOpenTil)}</Text>
                  {petitionList && petitionList.closedDate && (
                    <Text>
                      {format(new Date(petitionList.closedDate), 'dd.MM.yyyy')}
                    </Text>
                  )}
                </Box>
                <Box width="half">
                  <Text variant="h4">{formatMessage(m.listOwner)}</Text>
                  <Text>{petitionList.ownerName}</Text>
                </Box>
              </Box>

              <Box marginTop={4}>
                <Box width="half" marginBottom={2}>
                  <Input
                    label={formatMessage(m.name)}
                    name={formatMessage(m.name)}
                    value={userData?.nationalRegistryUser?.fullName}
                    readOnly
                  />
                </Box>
                <CheckboxController
                  id="showName"
                  large={false}
                  onSelect={() => setShowName(!showName)}
                  options={[
                    {
                      value: 'allow',
                      label: formatMessage(m.hideNameLabel),
                    },
                  ]}
                />
              </Box>

              <Box marginTop={5}>
                <CheckboxController
                  id="terms"
                  large={true}
                  backgroundColor="blue"
                  disabled={listClosed}
                  onSelect={() => setAcceptTerms(!acceptTerms)}
                  options={[
                    {
                      value: YES,
                      label: formatMessage(m.agreeToTermsLabel),
                    },
                  ]}
                />
              </Box>
            </Stack>
          ) : (
            <Skeleton />
          )}
          {listClosed && (
            <Text variant="eyebrow" color="red400">
              {formatMessage(m.listClosedMessage)}
            </Text>
          )}
          <Box marginY={8} display="flex" justifyContent="flexEnd">
            <Button
              loading={submitLoad}
              disabled={!acceptTerms}
              icon="checkmark"
              onClick={() => signPetition()}
            >
              {formatMessage(m.signPetition)}
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default SignPetitionView
