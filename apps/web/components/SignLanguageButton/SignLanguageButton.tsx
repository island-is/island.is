import {
  Box,
  Button,
  GridColumn,
  GridRow,
  Icon,
} from '@island.is/island-ui/core'
import { useState, ReactNode } from 'react'
import { ModalBase } from '@island.is/island-ui/core'
import { EmbeddedVideo } from '@island.is/island-ui/contentful'
import { useI18n } from '@island.is/web/i18n'

interface SignLanguageButtonProps {
  videoUrl: string
  content: ReactNode
}

export const SignLanguageButton = ({
  videoUrl,
  content,
}: SignLanguageButtonProps) => {
  const { activeLocale } = useI18n()

  const [isModalVisible, setIsModalVisible] = useState(false)

  return (
    <>
      <ModalBase
        baseId="sign-language-modal"
        isVisible={isModalVisible}
        onVisibilityChange={setIsModalVisible}
      >
        <Box padding="p3" background="white">
          <Box display="flex" justifyContent="flexEnd">
            <Box cursor="pointer" onClick={() => setIsModalVisible(false)}>
              <Icon icon="close" />
            </Box>
          </Box>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12', '6/12']}>
              <EmbeddedVideo url={videoUrl} locale={activeLocale} />
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '12/12', '12/12', '6/12']}>
              {content}
            </GridColumn>
          </GridRow>
        </Box>
      </ModalBase>
      <Button onClick={() => setIsModalVisible(true)}>Sign language</Button>
    </>
  )
}
