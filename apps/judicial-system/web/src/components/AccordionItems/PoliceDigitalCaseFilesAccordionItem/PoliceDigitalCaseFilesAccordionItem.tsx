import { FC } from 'react'
import { AnimatePresence, motion } from 'motion/react'

import {
  AccordionItem,
  Box,
  Icon,
  LoadingDots,
  Text,
} from '@island.is/island-ui/core'
import { PoliceDigitalCaseFile } from '@island.is/judicial-system-web/src/graphql/schema'

interface Props {
  digitalCaseFiles: PoliceDigitalCaseFile[] | null | undefined
  digitalCaseFilesLoading: boolean
  openDigitalCaseFileUrl: (policeDigitalFileId: string) => void
}

const PoliceDigitalCaseFilesAccordionItem: FC<Props> = ({
  digitalCaseFiles,
  digitalCaseFilesLoading,
  openDigitalCaseFileUrl,
}) => {
  return (
    <AccordionItem
      id="id_7"
      label={
        <Box display="flex" alignItems="center">
          <Text variant="h3" as="span">
            {'Rafræn gögn ('}
          </Text>
          {digitalCaseFilesLoading ? (
            <LoadingDots size="small" color="black" />
          ) : (
            <Text variant="h3" as="span">
              {digitalCaseFiles?.length ?? 0}
            </Text>
          )}
          <Text variant="h3" as="span">
            {')'}
          </Text>
        </Box>
      }
    >
      <AnimatePresence mode="wait" initial={false}>
        {digitalCaseFilesLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            <Box display="flex" justifyContent="center">
              <LoadingDots />
            </Box>
          </motion.div>
        ) : (
          <motion.div
            key="files"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.2 }}
          >
            {!digitalCaseFiles?.length ? (
              <Text>
                Engin rafræn gögn fylgja kröfunni í Réttarvörslugátt.
              </Text>
            ) : (
              <Text marginBottom={2}>
                Tenglarnir færa þig yfir á öruggt gagnasvæði lögreglunnar. Allar
                heimsóknir á þann vef eru skráðar og rekjanlegar.
              </Text>
            )}
            {digitalCaseFiles?.map((file, index) => (
              <Box
                key={index}
                component="button"
                type="button"
                display="flex"
                alignItems="center"
                columnGap={1}
                onClick={() => openDigitalCaseFileUrl(file.policeDigitalFileId)}
                cursor="pointer"
                background="transparent"
                textAlign="left"
                paddingY={1}
              >
                <Text as="span" color="blue400" variant="h4">
                  {file.name}
                </Text>
                <Icon icon="open" type="outline" size="small" color="blue400" />
              </Box>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </AccordionItem>
  )
}

export default PoliceDigitalCaseFilesAccordionItem
