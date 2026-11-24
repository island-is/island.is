import type { FC } from 'react'
import { useContext } from 'react'
import { useIntl } from 'react-intl'

import {
  Box,
  Input,
  InputFileUpload,
  RadioButton,
} from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  BlueBox,
  FormContext,
  SectionHeading,
} from '@island.is/judicial-system-web/src/components'
import RadioGroup from '@island.is/judicial-system-web/src/components/RadioGroup/RadioGroup'
import type {
  AppealCase,
  UpdateAppealCaseInput,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { AppealRulingType } from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  useAppealCase,
  useDebouncedField,
  useSerializedSave,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  stack,
  twoColumn,
} from '@island.is/judicial-system-web/src/utils/styles/recipes.css'
import { applyAppealCaseUpdate } from '@island.is/judicial-system-web/src/utils/utils'

import {
  appealRulingDecisionOptions,
  appealRulingTypeLabels,
  getAppealRulingTypeWording,
} from './RegisterConclusion.logic'

interface Props {
  // The ruling document as the page holds it, uploaded or on its way. The
  // page owns the uploads so they outlast the form when it folds away.
  rulingFiles: TUploadFile[]
  onUpload: (files: File[]) => void
  onRemove: (file: TUploadFile) => void
  onRetry: (file: TUploadFile) => void
  onOpenFile: (file: TUploadFile) => void
}

const rulingTypes = [AppealRulingType.VERDICT, AppealRulingType.RULING]

// The outcome and its type are saved as one value: the first outcome the court
// picks writes both.
type RulingChoice = Pick<
  AppealCase,
  'appealRulingDecision' | 'appealRulingType'
>

const rulingChoiceOf = (
  appealCase?: Partial<AppealCase> | null,
): RulingChoice => ({
  appealRulingDecision: appealCase?.appealRulingDecision,
  appealRulingType: appealCase?.appealRulingType,
})

/**
 * Where the court records how a verdict appeal ended: the outcome, whether it
 * ends with a verdict or a ruling, the concluding words and the document.
 *
 * Everything is saved on the appeal as the court fills it in. Whether it is a
 * verdict or a ruling only words the form; it is saved as a verdict with the
 * first outcome the court picks, so what the form shows is what is stored.
 * The document is uploaded by the page, which holds the list, and the form
 * shows what it is given.
 *
 * The outcome and its type show on the form at once and their saves run one
 * at a time in the order they were made. One that fails puts the working case
 * back to the choice the appeal last held. The concluding words are saved the
 * way every debounced field is.
 */
const RegisterConclusion: FC<Props> = ({
  rulingFiles,
  onUpload,
  onRemove,
  onRetry,
  onOpenFile,
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const verdictAppealCase = workingCase.verdictAppealCase
  const { formatMessage } = useIntl()
  const { updateAppealCase } = useAppealCase()

  const wording = getAppealRulingTypeWording(
    verdictAppealCase?.appealRulingType,
  )

  const saveRulingChoice = useSerializedSave<RulingChoice>()

  // Puts the working case back to the choice the appeal holds. The component
  // outlives a case change, so a save that fails after the court has moved on
  // must not touch the other case.
  const revert = (caseId: string, appealCaseId: string, update: RulingChoice) =>
    setWorkingCase((previous) =>
      previous.id === caseId
        ? applyAppealCaseUpdate(previous, appealCaseId, update)
        : previous,
    )

  const setAndSendToServer = (
    update: Omit<UpdateAppealCaseInput, 'caseId' | 'appealCaseId'>,
  ) => {
    if (!verdictAppealCase) {
      return
    }

    const caseId = workingCase.id
    const appealCaseId = verdictAppealCase.id

    // Read before the optimistic update below is applied
    const confirmed = rulingChoiceOf(verdictAppealCase)
    const value = rulingChoiceOf({ ...verdictAppealCase, ...update })

    setWorkingCase((previous) =>
      applyAppealCaseUpdate(previous, appealCaseId, update),
    )

    saveRulingChoice({
      key: `${caseId}:${appealCaseId}:rulingChoice`,
      confirmed,
      value,
      // The whole choice, not only what changed: a save queued behind one
      // that fails then still stores everything the form shows.
      persist: async () =>
        Boolean(
          await updateAppealCase(caseId, appealCaseId, {
            ...(value.appealRulingDecision
              ? { appealRulingDecision: value.appealRulingDecision }
              : {}),
            ...(value.appealRulingType
              ? { appealRulingType: value.appealRulingType }
              : {}),
          }),
        ),
      rollback: (choice) => revert(caseId, appealCaseId, choice),
    })
  }

  const conclusionField = useDebouncedField({
    value: verdictAppealCase?.appealConclusion,
    validations: ['empty'],
    onChange: (appealConclusion) => {
      if (verdictAppealCase) {
        setWorkingCase((previous) =>
          applyAppealCaseUpdate(previous, verdictAppealCase.id, {
            appealConclusion,
          }),
        )
      }
    },
    onSave: (appealConclusion) => {
      if (verdictAppealCase) {
        updateAppealCase(workingCase.id, verdictAppealCase.id, {
          appealConclusion,
        })
      }
    },
  })

  return (
    <div className={stack({ gap: 5 })}>
      <Box component="section">
        <SectionHeading title="Lyktir" required />
        <BlueBox>
          <RadioGroup legend="Lyktir" hideLegend className={stack({ gap: 2 })}>
            {appealRulingDecisionOptions.map(({ decision, label }) => (
              <RadioButton
                key={decision}
                name="verdict-appeal-ruling-decision"
                id={`verdict-appeal-ruling-decision-${decision}`}
                label={label}
                checked={verdictAppealCase?.appealRulingDecision === decision}
                onChange={() =>
                  setAndSendToServer({
                    appealRulingDecision: decision,
                    ...(verdictAppealCase?.appealRulingType
                      ? {}
                      : { appealRulingType: AppealRulingType.VERDICT }),
                  })
                }
                large
                backgroundColor="white"
              />
            ))}
          </RadioGroup>
        </BlueBox>
      </Box>
      <Box component="section">
        <SectionHeading title="Dómur eða úrskurður" required />
        <BlueBox>
          <RadioGroup
            legend="Dómur eða úrskurður"
            hideLegend
            className={twoColumn({ gap: 2 })}
          >
            {rulingTypes.map((rulingType) => (
              <RadioButton
                key={rulingType}
                name="verdict-appeal-ruling-type"
                id={`verdict-appeal-ruling-type-${rulingType}`}
                label={appealRulingTypeLabels[rulingType]}
                checked={verdictAppealCase?.appealRulingType === rulingType}
                onChange={() =>
                  setAndSendToServer({ appealRulingType: rulingType })
                }
                large
                backgroundColor="white"
              />
            ))}
          </RadioGroup>
        </BlueBox>
      </Box>
      <Box component="section">
        <SectionHeading title={wording.conclusion} required />
        <Input
          name="verdict-appeal-conclusion"
          label={wording.conclusion}
          placeholder={wording.conclusionPlaceholder}
          value={conclusionField.value}
          onChange={(event) => conclusionField.onChange(event.target.value)}
          onBlur={(event) => conclusionField.onBlur(event.target.value)}
          hasError={conclusionField.hasError}
          errorMessage={conclusionField.errorMessage}
          rows={7}
          textarea
          required
        />
      </Box>
      <Box component="section">
        <SectionHeading title={wording.document} required />
        <InputFileUpload
          name="verdict-appeal-ruling"
          files={rulingFiles}
          accept="application/pdf"
          multiple={false}
          title="Dragðu gögn hingað til að hlaða upp"
          description={formatMessage(
            {
              id: core.uploadBoxDescription,
              defaultMessage: core.uploadBoxDescription,
            },
            { fileEndings: '.pdf' },
          )}
          buttonLabel="Velja gögn til að hlaða upp"
          onChange={(files) => onUpload(files)}
          onOpenFile={(file) => onOpenFile(file)}
          onRemove={(file) => onRemove(file)}
          onRetry={(file) => onRetry(file)}
        />
      </Box>
    </div>
  )
}

export default RegisterConclusion
