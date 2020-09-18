import React, { FC, useState } from 'react'
import {
  Box,
  Stack,
  Typography,
  Button,
  Checkbox,
  Link,
  Inline,
} from '@island.is/island-ui/core'
import { ProcessPageLayout } from '../Layouts'
import { useI18n } from '@island.is/skilavottord-web/i18n'
import useRouteNames from '@island.is/skilavottord-web/i18n/useRouteNames'
import { useRouter } from 'next/router'
import { CarDetailsBox } from './components'
import OutlinedBox from '@island.is/skilavottord-web/components/OutlinedBox/OutlinedBox'
import * as styles from './Confirm.treat'
import { useQuery } from '@apollo/client'
import { GET_USER } from '@island.is/skilavottord-web/graphql/queries'

const nationalId = '2222222222'

const Confirm = () => {
  const [checkbox, setCheckbox] = useState(false)

  const {
    t: { confirm: t },
  } = useI18n()

  const Router = useRouter()
  const { makePath } = useRouteNames()

  const { id } = Router.query

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { nationalId },
  })

  if (error || (loading && !data)) {
    return <>ERROR</>
  }
  const { cars } = data.getCarownerByNationalId || {}

  let car = {
    id: null,
    model: null,
    brand: null,
    year: null,
    status: null,
    hasCoOwner: null,
    name: null,
    color: null,
    recyclable: null,
  }

  for (const carEntry of cars) {
    if (carEntry.id === id) {
      car = carEntry
    }
  }

  const onCancel = () => {
    Router.push({
      pathname: makePath('myCars'),
    })
  }

  const onContinue = (id) => {
    // Login with return URL
    // with car info
    // Mutate data on DB
    console.log('login')
    console.log('mutate be')
  }

  const checkboxLabel = (
    <>
      <Inline space={1}>
        {t.checkbox.label}
        <Link
          href=""
          className={
            checkbox
              ? styles.checkboxLabelLinkChecked
              : styles.checkboxLabelLink
          }
        >
          {t.checkbox.linkLabel}
        </Link>
      </Inline>
    </>
  )

  return (
    <ProcessPageLayout>
      <Stack space={4}>
        <Typography variant="h1">{t.title}</Typography>
        <Stack space={2}>
          <Typography variant="h3">{t.subTitles.confirm}</Typography>
          <Typography variant="p">{t.info}</Typography>
        </Stack>
        <Stack space={2}>
          <CarDetailsBox car={car} />
          <OutlinedBox backgroundColor="blue100" borderColor="white">
            <Box padding={4}>
              <Checkbox
                name="confirm"
                label={checkboxLabel.props.children}
                onChange={({ target }) => {
                  setCheckbox(target.checked)
                }}
                checked={checkbox}
                disabled={!car.recyclable}
              />
            </Box>
          </OutlinedBox>
        </Stack>
        <Box width="full" display="inlineFlex" justifyContent="spaceBetween">
          <Button variant="ghost" onClick={onCancel}>
            {t.buttons.cancel}
          </Button>
          <Link
            href="/recycling-companies"
            as={makePath('recyclingCompanies', id.toString())}
            passHref
          >
            <Button
              variant="normal"
              disabled={!checkbox}
              icon="arrowRight"
              onClick={onContinue}
            >
              {t.buttons.continue}
            </Button>
          </Link>
        </Box>
      </Stack>
    </ProcessPageLayout>
  )
}

export default Confirm
