import React, { useContext } from 'react'
import { Box, Button, Divider, Icon, Text } from '@island.is/island-ui/core'
import { useRouter } from 'next/router'

import { FormContext } from '@island.is/financial-aid-web/osk/src/components/FormProvider/FormProvider'
import {
  Employment,
  getEmploymentStatus,
  getHomeCircumstances,
  HomeCircumstances,
} from '@island.is/financial-aid/shared/lib'

interface Props {
  error: boolean
}

const FormInfo = ({ error }: Props) => {
  const router = useRouter()

  const { form } = useContext(FormContext)

  const overview = [
    {
      label: 'Búseta',
      url: 'buseta',
      info:
        form?.homeCircumstances === HomeCircumstances.OTHER
          ? form?.homeCircumstancesCustom
          : getHomeCircumstances[form?.homeCircumstances as HomeCircumstances],
      formError: Boolean(!form?.homeCircumstances) && error,
    },
    {
      label: 'Tekjur',
      url: 'tekjur',
      info:
        'Ég hef ' +
        (form?.incomeFiles ? '' : 'ekki') +
        'fengið tekjur í þessum mánuði eða síðasta',
    },
    {
      label: 'Staða',
      url: 'atvinna',
      info: form?.employmentCustom
        ? form?.employmentCustom
        : getEmploymentStatus[form?.employment as Employment],
      formError: Boolean(!form?.employment) && error,
    },
    {
      label: 'Netfang',
      url: 'samskipti',
      info: form?.emailAddress,
      formError: Boolean(!form?.emailAddress) && error,
    },
  ]

  return (
    <>
      {' '}
      {overview.map((item, index) => {
        return (
          <span key={'overview-' + index}>
            <Divider />

            <Box
              display="flex"
              justifyContent="spaceBetween"
              alignItems="flexStart"
              paddingY={[4, 4, 5]}
            >
              <Box marginRight={3}>
                <Text
                  fontWeight="semiBold"
                  color={item.formError ? 'red600' : 'dark400'}
                >
                  {item.label} {item.formError ? '*' : ''}
                </Text>
                <Text>{item.info}</Text>
              </Box>

              {item.url && (
                <Button
                  icon="pencil"
                  iconType="filled"
                  variant="utility"
                  onClick={() => {
                    router.push(item.url)
                  }}
                >
                  Breyta
                </Button>
              )}
            </Box>
          </span>
        )
      })}
    </>
  )
}

export default FormInfo
