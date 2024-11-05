import { Box, Link, Logo, Text, Button, Input } from '@island.is/island-ui/core'

import * as styles from './PageCard.css'
import { PageCenter } from '../PageCenter/PageCenter'

type PageCardWrapperProps = {
  organizationTitle?: string
  organizationImageSrc?: string
  organizationImageAlt?: string
  amount?: number
  availablePaymentMethods: string[]
  children?: React.ReactNode
}

export const PageCard = ({
  organizationTitle,
  organizationImageSrc,
  organizationImageAlt,
  amount,
  availablePaymentMethods,
  children,
}: PageCardWrapperProps) => {
  // const { formatMessage, changeLanguage, locale } = useLocale()

  const hasCard = availablePaymentMethods.includes('card')
  const hasInvoice = availablePaymentMethods.includes('invoice')

  return (
    <PageCenter verticalCenter={false}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        rowGap={2}
        width="full"
        className={styles.container}
      >
        <Box marginTop={[8, 8, 15]} className={styles.cardContainer}>
          <Box
            paddingX={[3, 4]}
            paddingTop={2}
            paddingBottom={4}
            className={styles.headerContainer}
            flexDirection="row"
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
          >
            <Box>
              {organizationTitle && (
                <Box
                  display="flex"
                  justifyContent="center"
                  marginTop={3}
                  marginBottom={1}
                >
                  <Text color="blue400" variant="eyebrow">
                    {organizationTitle}
                  </Text>
                </Box>
              )}
              <Text variant="h1">129.000 kr.</Text>
              <Text>Rekstrarleyfi (TODO)</Text>
            </Box>

            {organizationImageSrc && (
              <img
                style={{ width: 64, height: 64 }}
                src={organizationImageSrc}
                alt={organizationImageAlt}
              />
            )}
          </Box>
          <Box
            paddingX={[3, 4]}
            paddingTop={4}
            paddingBottom={5}
            display="flex"
            width="full"
            flexDirection="column"
            justifyContent="spaceBetween"
            columnGap={1}
            rowGap={2}
          >
            {availablePaymentMethods.length > 0 && (
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="spaceBetween"
                columnGap={1}
              >
                {hasCard && (
                  <Button colorScheme="white" fluid>
                    Kort
                  </Button>
                )}
                {hasCard && (
                  <Button colorScheme="light" variant="primary" fluid>
                    Krafa
                  </Button>
                )}
              </Box>
            )}
            {/* {children} */}
            <Input
              backgroundColor="blue"
              label="Kortanúmer"
              name="card"
              placeholder="**** **** **** ****"
              size="md"
            />
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              columnGap={2}
            >
              <Input
                backgroundColor="blue"
                label="Gildistími"
                name="cardExpiry"
                size="md"
              />
              <Input
                backgroundColor="blue"
                label="CVC"
                name="cardCVC"
                size="md"
              />
            </Box>
            <Button fluid>Greiða</Button>
          </Box>
        </Box>
        <footer className={styles.footer}>
          <Box display="flex" justifyContent="spaceBetween" alignItems="center">
            <Link href="https://island.is/skilmalar-island-is">
              <Logo width={120} />
            </Link>
            <Box display="flex" columnGap={2}>
              <Link href="todo" onClick={() => alert('todo')}>
                English
              </Link>
              <span className={styles.linkSeparator} />
              <Link href="https://island.is/minar-sidur-adgangsstyring">
                Aðstoð
              </Link>
            </Box>
          </Box>
        </footer>
      </Box>
    </PageCenter>
  )
}
