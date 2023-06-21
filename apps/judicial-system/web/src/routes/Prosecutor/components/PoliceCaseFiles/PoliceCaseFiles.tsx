import React, { Fragment, useContext, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import cn from 'classnames'

import {
  PoliceCaseFile,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import {
  AlertMessage,
  Box,
  Button,
  Checkbox,
  LoadingDots,
} from '@island.is/island-ui/core'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import { CaseOrigin } from '@island.is/judicial-system-web/src/graphql/schema'

import { policeCaseFiles as m } from './PoliceCaseFiles.strings'
import PoliceCaseFilesMessageBox from '../PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'
import { PoliceCaseFilesData } from '../CaseFiles/CaseFiles'
import * as styles from './PoliceCaseFiles.css'

export interface PoliceCaseFileCheck extends PoliceCaseFile {
  checked: boolean
}

const CheckboxListItem: React.FC = ({ children }) => (
  <motion.li
    layout
    className={styles.policeCaseFile}
    initial={{
      opacity: 0,
    }}
    animate={{
      opacity: 1,
    }}
    exit={{
      opacity: 0,
    }}
  >
    {children}
  </motion.li>
)

interface ListItemProps {
  files: PoliceCaseFileCheck[]
  isUploading: boolean
  onCheck: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CheckboxList: React.FC<ListItemProps> = ({
  files,
  isUploading,
  onCheck,
}) => (
  <AnimatePresence>
    {files.map((file) => (
      <Fragment key={file.id}>
        <CheckboxListItem>
          <Checkbox
            label={
              <Box
                display="flex"
                alignItems="center"
                justifyContent="spaceBetween"
              >
                {file.name}
                {isUploading && file.checked && <LoadingDots />}
              </Box>
            }
            name={file.id}
            value={file.id}
            checked={file.checked}
            onChange={onCheck}
            disabled={isUploading}
          />
        </CheckboxListItem>
      </Fragment>
    ))}
  </AnimatePresence>
)

interface Props {
  onUpload: () => Promise<void>
  isUploading: boolean
  policeCaseFileList: PoliceCaseFileCheck[]
  setPoliceCaseFileList: React.Dispatch<
    React.SetStateAction<PoliceCaseFileCheck[]>
  >
  policeCaseFiles?: PoliceCaseFilesData
}

const PoliceCaseFiles: React.FC<Props> = ({
  onUpload,
  isUploading,
  policeCaseFileList,
  setPoliceCaseFileList,
  policeCaseFiles,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)
  const [checkAllChecked, setCheckAllChecked] = useState<boolean>(false)

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
          return {
            id: l.id,
            name: l.name,
            policeCaseNumber: l.policeCaseNumber,
            checked: evt.target.checked,
          }
        }),
      )
    } else {
      newPoliceCaseFileList[target].checked = !newPoliceCaseFileList[target]
        .checked
      setPoliceCaseFileList(newPoliceCaseFileList)
    }
  }

  return (
    <Box marginBottom={5}>
      {workingCase.origin === CaseOrigin.LOKE && (
        <LayoutGroup>
          <motion.div layout className={styles.policeCaseFilesContainer}>
            <motion.ul layout>
              <motion.li
                layout
                className={cn(styles.policeCaseFile, {
                  [styles.selectAllPoliceCaseFiles]: true,
                })}
              >
                <Checkbox
                  name="selectAllPoliceCaseFiles"
                  label={formatMessage(m.selectAllLabel)}
                  checked={checkAllChecked}
                  onChange={(evt) => toggleCheckbox(evt, true)}
                  disabled={isUploading || policeCaseFileList.length === 0}
                  strong
                />
              </motion.li>
              {policeCaseFiles?.isLoading ? (
                <Box
                  textAlign="center"
                  paddingY={2}
                  paddingX={3}
                  marginBottom={2}
                >
                  <LoadingDots />
                </Box>
              ) : policeCaseFiles?.hasError ? (
                policeCaseFiles?.errorCode ===
                'https://httpstatuses.org/404' ? (
                  <PoliceCaseFilesMessageBox
                    icon="warning"
                    iconColor="yellow400"
                    message={formatMessage(m.caseNotFoundInLOKEMessage)}
                  />
                ) : (
                  <PoliceCaseFilesMessageBox
                    icon="close"
                    iconColor="red400"
                    message={formatMessage(m.couldNotGetFromLOKEMessage)}
                  />
                )
              ) : policeCaseFiles?.files.length === 0 ? (
                <PoliceCaseFilesMessageBox
                  icon="warning"
                  iconColor="yellow400"
                  message={formatMessage(m.noFilesFoundInLOKEMessage)}
                />
              ) : policeCaseFileList.length > 0 ? (
                <CheckboxList
                  files={policeCaseFileList}
                  isUploading={isUploading}
                  onCheck={toggleCheckbox}
                />
              ) : (
                <PoliceCaseFilesMessageBox
                  icon="checkmark"
                  iconColor="blue400"
                  message={formatMessage(m.allFilesUploadedMessage)}
                />
              )}
            </motion.ul>
          </motion.div>
          <motion.div layout className={styles.uploadToRVGButtonContainer}>
            <Button
              onClick={async () => {
                await onUpload()
                setCheckAllChecked(false)
              }}
              loading={isUploading}
              disabled={policeCaseFileList.every((p) => !p.checked)}
            >
              {formatMessage(m.uploadButtonLabel)}
            </Button>
          </motion.div>
        </LayoutGroup>
      )}
      {workingCase.origin !== CaseOrigin.LOKE && (
        <AlertMessage
          type="info"
          title={formatMessage(m.originNotLokeTitle, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
          message={formatMessage(m.originNotLokeMessage, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
        ></AlertMessage>
      )}
    </Box>
  )
}

export default PoliceCaseFiles
