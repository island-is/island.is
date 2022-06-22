import React, { FC } from 'react'
import {
  Box,
  Bullet,
  BulletList,
  Button,
  GridColumn,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { Modal } from '@island.is/service-portal/core'
import { InputController } from '@island.is/shared/form-fields'
import { useForm } from 'react-hook-form'
import { useLocale, useNamespaces } from '@island.is/localization'
import { sharedMessages } from '@island.is/shared/translations'

type RegistrationData = {
  parentName: string
  parentNationalId: string
  childName: string
  childNationalId: string
}

interface Props {
  onClose: () => void
  toggleClose: boolean
  data: RegistrationData
}
export const ChildRegistrationModal: FC<Props> = ({
  children,
  onClose,
  toggleClose,
  data,
}) => {
  useNamespaces('sp.family')
  const { handleSubmit, control, errors, reset } = useForm()
  const { formatMessage } = useLocale()

  return (
    <Modal id="" onCloseModal={onClose} toggleClose={toggleClose}>
      <Box marginTop={[3, 0]}>
        <Box paddingBottom={4}>
          <Text variant="h4" paddingBottom={3}>
            {formatMessage({
              id: 'sp.family:child-registration-text',
              defaultMessage: 'Athugasemdir vegna skráningar barns',
            })}
          </Text>
          <BulletList>
            <Bullet>
              {formatMessage({
                id: 'sp.family:child-registration-parent-name',
                defaultMessage: 'Nafn þess sem tilkynnir ranga skráningu: ',
              })}
              {data.parentName}
            </Bullet>
            <Bullet>
              {formatMessage({
                id: 'sp.family:child-registration-parent-id',
                defaultMessage:
                  'Kennitala þess sem tilkynnir ranga skráningu: ',
              })}
              {data.parentNationalId}
            </Bullet>
            <Bullet>
              {formatMessage({
                id: 'sp.family:child-registration-name',
                defaultMessage: 'Nafn barns sem tilkynning á við: ',
              })}
              {data.childName}
            </Bullet>
            <Bullet>
              {formatMessage({
                id: 'sp.family:child-registration-ssn',
                defaultMessage: 'Kennitala barns sem tilkynning á við: ',
              })}
              {data.childNationalId}
            </Bullet>
          </BulletList>
        </Box>
        <form onSubmit={() => console.log('submitted')}>
          <Box>
            <GridRow marginBottom={3}>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  control={control}
                  id="email"
                  name="telemail"
                  required={true}
                  type="email"
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:email-required-msg',
                        defaultMessage: 'Skylda er að fylla út netfang',
                      }),
                    },
                  }}
                  label={formatMessage(sharedMessages.email)}
                  size="xs"
                />
              </GridColumn>
              <GridColumn span={['12/12', '6/12']}>
                <InputController
                  control={control}
                  id="tel"
                  name="tel"
                  required={true}
                  type="tel"
                  format={'### ####'}
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:tel-required-msg',
                        defaultMessage: 'Skylda er að fylla út símanúmer',
                      }),
                    },
                  }}
                  label={formatMessage(sharedMessages.phoneNumber)}
                  error={errors.tel?.message}
                  size="xs"
                />
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <InputController
                  control={control}
                  id="text"
                  name="text"
                  required={true}
                  type="text"
                  textarea
                  rules={{
                    required: {
                      value: true,
                      message: formatMessage({
                        id: 'sp.family:text-required-msg',
                        defaultMessage: 'Skylda er að fylla út athugasemd',
                      }),
                    },
                  }}
                  label={formatMessage({
                    id: 'sp.family:text-required-msg-label',
                    defaultMessage: 'Athugasemd',
                  })}
                  error={errors.tel?.message}
                  size="xs"
                />
              </GridColumn>
            </GridRow>
          </Box>
          <Box
            display="flex"
            justifyContent="flexEnd"
            alignItems="center"
            flexDirection={['columnReverse', 'row']}
            marginTop={4}
          >
            <Button
              variant="primary"
              type="submit"
              size="small"
              icon="arrowForward"
              disabled={false}
            >
              {formatMessage({
                id: 'sp.family:child-registration-send',
                defaultMessage: 'Senda tilkynningu',
              })}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  )
}

export default ChildRegistrationModal
