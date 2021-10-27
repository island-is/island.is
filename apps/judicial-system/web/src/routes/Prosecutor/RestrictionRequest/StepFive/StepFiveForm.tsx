import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { useIntl } from 'react-intl'
import {
  Text,
  Box,
  ContentBlock,
  InputFileUpload,
  Input,
  Tooltip,
  Checkbox,
  Button,
  LoadingDots,
  AlertMessage,
} from '@island.is/island-ui/core'
import type { Case } from '@island.is/judicial-system/types'
import * as Constants from '@island.is/judicial-system-web/src/utils/constants'
import {
  useCase,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  FormContentContainer,
  FormFooter,
} from '@island.is/judicial-system-web/src/shared-components'
import { rcCaseFiles as m } from '@island.is/judicial-system-web/messages'
import { removeTabsValidateAndSet } from '@island.is/judicial-system-web/src/utils/formHelper'
import { parseString } from '@island.is/judicial-system-web/src/utils/formatters'
import MarkdownWrapper from '@island.is/judicial-system-web/src/shared-components/MarkdownWrapper/MarkdownWrapper'
import { AnimatePresence, AnimateSharedLayout, motion } from 'framer-motion'
import { theme } from '@island.is/island-ui/theme'
import * as styles from './StepFive.css'
import { PoliceCaseFilesData } from './StepFive'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case | undefined>>
  policeCaseFiles?: PoliceCaseFilesData
}

export const StepFiveForm: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, policeCaseFiles } = props
  const { formatMessage } = useIntl()
  const [policeCaseFileList, setPoliceCaseFileList] = useState<
    { id: string; label: string; checked: boolean }[]
  >([])
  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)

  useEffect(() => {
    if (policeCaseFiles?.files) {
      setPoliceCaseFileList(
        policeCaseFiles.files.map((policeCaseFile) => {
          return {
            id: policeCaseFile.id,
            label: policeCaseFile.name,
            checked: false,
          }
        }),
      )
    }
  }, [policeCaseFiles])

  const {
    files,
    uploadErrorMessage,
    allFilesUploaded,
    uploadPoliceCaseFile,
    onChange,
    onRemove,
    onRetry,
  } = useS3Upload(workingCase)
  const { updateCase } = useCase()

  const toggleCheckbox = (
    evt: React.ChangeEvent<HTMLInputElement>,
    checkAll?: boolean,
  ) => {
    const newPoliceCaseFileList = [...policeCaseFileList]
    const target = policeCaseFileList.findIndex(
      (listItem) => listItem.id.toString() === evt.target.value,
    )

    if (checkAll) {
      setCheckAllChecked(!checkAllChecked)
      setPoliceCaseFileList(
        policeCaseFileList.map((l) => {
          return { id: l.id, label: l.label, checked: evt.target.checked }
        }),
      )
    } else {
      newPoliceCaseFileList[target].checked = !newPoliceCaseFileList[target]
        .checked

      setPoliceCaseFileList(newPoliceCaseFileList)
    }
  }

  const uploadToRVG = async () => {
    const newPoliceCaseFileList = [...policeCaseFileList]

    policeCaseFileList
      .filter((p) => p.checked)
      .forEach(async (policeCaseFile) => {
        await uploadPoliceCaseFile(policeCaseFile.id, policeCaseFile.label)

        setPoliceCaseFileList(
          newPoliceCaseFileList.filter((p) => p.id !== policeCaseFile.id),
        )
      })
  }

  return (
    <>
      <FormContentContainer>
        <Box marginBottom={7}>
          <Text as="h1" variant="h1">
            {formatMessage(m.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <Box marginBottom={3}>
            <Text as="h3" variant="h3">
              {formatMessage(m.sections.description.heading)}
            </Text>
          </Box>
          <MarkdownWrapper
            text={m.sections.description.list}
            textProps={{ marginBottom: 0 }}
          />
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.policeCaseFiles.heading, {
              policeCaseNumber: workingCase.policeCaseNumber,
            })}
          </Text>
        </Box>
        <Box marginBottom={5}>
          {policeCaseFileList.length > 0 ? (
            <AnimateSharedLayout>
              <motion.div layout className={styles.policeCaseFilesContainer}>
                <motion.ul layout>
                  <motion.li
                    layout
                    className={cn(styles.policeCaseFile, {
                      [styles.selectAllPoliceCaseFiles]: true,
                    })}
                  >
                    <Checkbox
                      label="Velja allt"
                      checked={checkAllChecked}
                      onChange={(evt) => toggleCheckbox(evt, true)}
                      strong
                    />
                  </motion.li>
                  <AnimatePresence>
                    {policeCaseFileList.map((listItem) => {
                      return (
                        <motion.li
                          layout
                          className={styles.policeCaseFile}
                          key={listItem.label}
                          initial={{
                            opacity: 0,
                          }}
                          animate={{
                            opacity: 1,
                          }}
                          exit={{
                            backgroundColor: [
                              theme.color.blue100,
                              '#3ae374',
                              '#3ae374',
                              '#3ae374',
                              '#3ae374',
                            ],
                            opacity: [1, 1, 1, 1, 0],
                            transition: { duration: 3 },
                          }}
                        >
                          <Checkbox
                            label={listItem.label}
                            name={listItem.id}
                            value={listItem.id}
                            checked={listItem.checked}
                            onChange={(evt) => toggleCheckbox(evt)}
                          />
                        </motion.li>
                      )
                    })}
                  </AnimatePresence>
                </motion.ul>
              </motion.div>
              <motion.div layout className={styles.uploadToRVGButtonContainer}>
                <Button onClick={uploadToRVG}>Hlaða upp</Button>
              </motion.div>
            </AnimateSharedLayout>
          ) : policeCaseFiles?.isLoading ? (
            <Box textAlign="center">
              <LoadingDots />
            </Box>
          ) : (
            <AlertMessage
              type="error"
              title="Engin gögn fundust"
              message="Ekki tókst að sækja gögn úr LÖKE"
            />
          )}
        </Box>
        <Box marginBottom={3}>
          <Text variant="h3" as="h3">
            {formatMessage(m.sections.files.heading)}
          </Text>
        </Box>
        <Box marginBottom={5}>
          <ContentBlock>
            <InputFileUpload
              fileList={files}
              header={formatMessage(m.sections.files.label)}
              buttonLabel={formatMessage(m.sections.files.buttonLabel)}
              onChange={onChange}
              onRemove={onRemove}
              onRetry={onRetry}
              errorMessage={uploadErrorMessage}
              showFileSize
            />
          </ContentBlock>
        </Box>
        <Box>
          <Box marginBottom={3}>
            <Text variant="h3" as="h3">
              {formatMessage(m.sections.comments.heading)}{' '}
              <Tooltip
                placement="right"
                as="span"
                text={formatMessage(m.sections.comments.tooltip)}
              />
            </Text>
          </Box>
          <Box marginBottom={10}>
            <Input
              name="caseFilesComments"
              label={formatMessage(m.sections.comments.label)}
              placeholder={formatMessage(m.sections.comments.placeholder)}
              defaultValue={workingCase?.caseFilesComments}
              onChange={(event) =>
                removeTabsValidateAndSet(
                  'caseFilesComments',
                  event,
                  [],
                  workingCase,
                  setWorkingCase,
                )
              }
              onBlur={(evt) =>
                updateCase(
                  workingCase.id,
                  parseString('caseFilesComments', evt.target.value),
                )
              }
              textarea
              rows={7}
            />
          </Box>
        </Box>
      </FormContentContainer>
      <FormContentContainer isFooter>
        <FormFooter
          previousUrl={`${Constants.STEP_FOUR_ROUTE}/${workingCase.id}`}
          nextUrl={`${Constants.STEP_SIX_ROUTE}/${workingCase.id}`}
          nextIsDisabled={!allFilesUploaded}
        />
      </FormContentContainer>
    </>
  )
}
