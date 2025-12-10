import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Icon,
  Inline,
  ModalBase,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import * as s from './AdvertDisplay.css'
import { useLocale } from '@island.is/localization'
import { m } from '../../lib/messages'

type AdvertDisplayProps = {
  status?: string
  publicationDate?: string
  title?: string
  html?: string
  signatureLocation?: string
  signatureDate?: string
  signatureName?: string
  signatureOnBehalfOf?: string
  disclosure?: React.ReactElement
  modal?: boolean
  withBorder?: boolean
}

const Advert = ({
  status,
  publicationDate,
  title,
  html,
  signatureDate,
  signatureLocation,
  signatureName,
  signatureOnBehalfOf,
  withBorder = true,
}: AdvertDisplayProps) => {
  const showHeader = !!(status || publicationDate)
  const showBody = !!(title || html)

  const { formatMessage } = useLocale()

  return (
    <Box
      paddingX={[3, 4, 5]}
      paddingY={[4, 5, 6]}
      border={withBorder ? 'standard' : undefined}
      borderRadius="large"
    >
      <Stack space={5}>
        {showHeader && (
          <Inline align="right">
            <Stack space={0}>
              {status && <Text>{status}</Text>}
              {publicationDate && (
                <Text variant="medium">{`${formatMessage(
                  m.draft.sections.preview.estimatedPublicationDate,
                )} ${publicationDate}`}</Text>
              )}
            </Stack>
          </Inline>
        )}
        {showBody && (
          <Stack space={1}>
            {title && (
              <Text variant="medium" fontWeight="semiBold">
                {title}
              </Text>
            )}
            {html && (
              <Box
                position="relative"
                overflow="auto"
                className={s.bodyText}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}
          </Stack>
        )}
        <Inline align="right" space={2}>
          <Stack space={1}>
            {Boolean(signatureDate || signatureLocation) && (
              <Text variant="medium">
                {`${signatureLocation ? signatureLocation : ''}${
                  signatureDate ? `, ${signatureDate}` : ''
                }`}
              </Text>
            )}
            {Boolean(signatureOnBehalfOf) && (
              <Text variant="medium">{signatureOnBehalfOf}</Text>
            )}
            {Boolean(signatureName) && (
              <Text variant="medium" fontWeight="semiBold">
                {signatureName}
              </Text>
            )}
          </Stack>
        </Inline>
      </Stack>
    </Box>
  )
}

const AdvertDisplayModal = (props: AdvertDisplayProps) => {
  return (
    <ModalBase
      className={s.modalBase}
      disclosure={props.disclosure}
      baseId="advert-display-modal"
      hideOnClickOutside
      hideOnEsc
    >
      {({ closeModal }) => (
        <Stack align="center" space={0}>
          <GridContainer>
            <GridRow>
              <GridColumn span={['12/12', '8/12']} offset={['0', '2/12']}>
                <Box width="full" padding={2} background="white">
                  <Stack space={2}>
                    <Inline align="right">
                      <button onClick={closeModal}>
                        <Icon icon="close" />
                      </button>
                    </Inline>
                    <Advert {...props} />
                  </Stack>
                </Box>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Stack>
      )}
    </ModalBase>
  )
}

export const AdvertDisplay = (props: AdvertDisplayProps) => {
  return props.modal ? <AdvertDisplayModal {...props} /> : <Advert {...props} />
}
