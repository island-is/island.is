import React from 'react'
import {
  Box,
  Divider,
  Input,
  Text,
  Checkbox,
  Button,
} from '@island.is/island-ui/core'

import * as styles from './Profile.css'

import * as headerStyles from '@island.is/financial-aid-web/veita/src/components/ApplicationHeader/ApplicationHeader.css'

interface UserProps {}

const UserProfile = ({}: UserProps) => {
  const inputFields = [
    {
      label: 'Kennitala',
    },
    {
      label: 'Netfang',
      bgIsBlue: true,
    },
    {
      label: 'Stutt nafn',
    },
  ]

  return (
    <>
      <Box
        marginTop={15}
        marginBottom={15}
        className={`${styles.applicantWrapper} ${styles.widthAlmostFull}`}
      >
        <Box className={`${styles.widthAlmostFull}`}>
          <Box className={`contentUp delay-25`} marginBottom={[3, 3, 7]}>
            <Text as="h1" variant="h1" marginBottom={2}>
              Hlín Bergrún Guðmundsdóttir
            </Text>

            <Divider />

            <Box display="flex" marginRight={1} marginTop={5}>
              <Box marginRight={1}>
                <Text variant="small" fontWeight="semiBold" color="dark300">
                  Staða
                </Text>
              </Box>
              <Box marginRight={1}>
                <Text variant="small">Notandi er virkur</Text>
              </Box>
              <button className={headerStyles.button}>Sjá um</button>
            </Box>
          </Box>

          {inputFields.map((item, index) => {
            return (
              <Box
                className={`contentUp`}
                marginBottom={3}
                style={{ animationDelay: index * 10 + 30 + 'ms' }}
              >
                <Input
                  label={item.label}
                  name="Test1"
                  placeholder="This is the placeholder"
                  backgroundColor={item.bgIsBlue ? 'blue' : 'white'}
                />
              </Box>
            )
          })}

          <Box
            className={`contentUp delay-75`}
            marginTop={3}
            marginBottom={[3, 3, 5]}
          >
            {' '}
            <Text as="h2" variant="h3" color="dark300" marginBottom={3}>
              Réttindi notanda
            </Text>
            <Box marginBottom={3}>
              <Checkbox label="Vinnsluaðili" />
            </Box>
            <Box marginBottom={2}>
              <Checkbox label="Stjórnandi (Admin)" />
            </Box>
            <Text variant="small">
              Stjórnandi í Veitu hefur aðgang að stillingum sveitarfélagsins þar
              sem vefslóðir, netföng og upphæðir eru skilgreindar. Þessar
              stillingar hafa áhrif á Veitu, Ósk og Stöðusíðu auk þess sem þær
              koma einnig við sögu í sumum sjálfvirkum tölvupóstum til
              umsækjenda.
            </Text>
          </Box>
          <Box
            className={`contentUp delay-100`}
            marginTop={3}
            display="flex"
            justifyContent="flexEnd"
          >
            <Button
              icon="checkmark"
              onClick={() => console.log('hérna gerist magic')}
            >
              Vista stillingar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default UserProfile
