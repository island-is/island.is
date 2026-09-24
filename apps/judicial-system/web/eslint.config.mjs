import eslintPluginImport from 'eslint-plugin-import'
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y'
import eslintPluginSimpleImportSort from 'eslint-plugin-simple-import-sort'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import nx from '@nx/eslint-plugin'

import baseConfig from '../../../eslint.config.mjs'

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended,
})

const restrictedImportPaths = [
  'lodash',
  'date-fns',
  'date-fns/locale',
  'styled-components',
  '.',
  {
    name: '@island.is/island-ui/core',
    importNames: ['toast'],
    message:
      "Import toast from '@island.is/judicial-system-web/src/utils/toast' so that user-facing errors are logged.",
  },
  {
    name: 'react-toastify',
    message:
      "Import toast from '@island.is/judicial-system-web/src/utils/toast' so that user-facing errors are logged.",
  },
]

const caseSchemaTypeImport = {
  name: '@island.is/judicial-system-web/src/graphql/schema',
  importNames: ['Case'],
  message:
    "Type the case as WorkingCase from '@island.is/judicial-system-web/src/components' instead. Case is the full schema type, so it lets code read fields the case query never fetches.",
}

// Files that still type the case as the schema `Case`. In each of them a field
// the case query never fetches can be read without a compile error, so this list
// only shrinks: move a file to WorkingCase, then remove it here. New files are
// not added.
const caseSchemaTypeAllowlist = [
  'src/routes/Court/Indictments/Completed/ReopenCaseModal.tsx',
  'src/routes/Court/Indictments/Conclusion/SelectCandidateMergeCase.tsx',
  'src/routes/Court/Indictments/CourtRecord/CourtSessionAppealDecisions.spec.tsx',
  'src/routes/Court/Indictments/CourtRecord/CourtSessionAppealDecisions.tsx',
  'src/routes/Court/Indictments/CourtRecord/CourtSessionRuling.spec.tsx',
  'src/routes/Court/Indictments/Overview/Overview.spec.tsx',
  'src/routes/Court/Indictments/Subpoena/Subpoena.tsx',
  'src/routes/Court/InvestigationCase/CourtRecord/CourtRecord.tsx',
  'src/routes/Court/RestrictionCase/CourtRecord/helpers/endOfSessionBookings.ts',
  'src/routes/Court/RestrictionCase/Ruling/Ruling.logic.spec.ts',
  'src/routes/Court/RestrictionCase/Ruling/Ruling.logic.ts',
  'src/routes/Court/components/AppealSections/AppealSections.spec.tsx',
  'src/routes/Court/components/AppealSections/AppealSections.tsx',
  'src/routes/Court/components/AppealSections/useDebouncedAppealAnnouncement.spec.tsx',
  'src/routes/Court/components/DraftConclusionModal/DraftConclusionModal.tsx',
  'src/routes/Court/components/SubpoenaType/SubpoenaType.tsx',
  'src/routes/Court/shared/populateEndOfCourtSessionBookingsIntro.ts',
  'src/routes/CourtOfAppeal/Ruling/Ruling.spec.tsx',
  'src/routes/Defender/IndictmentCase/Appeal/VerdictAppeal.spec.tsx',
  'src/routes/Defender/IndictmentCase/IndictmentOverview.spec.tsx',
  'src/routes/Defender/IndictmentCase/verdictAppealActions.logic.spec.ts',
  'src/routes/Defender/IndictmentCase/verdictAppealActions.logic.ts',
  'src/routes/Prosecutor/Indictments/Defendant/PoliceCaseList/PoliceCaseList.spec.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/IndictmentCount.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/IndictmentCountAccordionItem.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/IndictmentCountsList.spec.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/IndictmentCountsList.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/Offenses/Offenses.tsx',
  'src/routes/Prosecutor/Indictments/Indictment/Offenses/SpeedingOffenseFields.tsx',
  'src/routes/Prosecutor/Indictments/IndictmentOverview/IndictmentOverview.spec.tsx',
  'src/routes/Prosecutor/Indictments/Overview/DenyIndictmentCaseModal/DenyIndictmentCaseModal.tsx',
  'src/routes/Prosecutor/Indictments/Overview/ReturnIndictmentModal/ReturnIndictmentModal.tsx',
  'src/routes/Prosecutor/InvestigationCase/Defendant/Defendant.tsx',
  'src/routes/Prosecutor/RestrictionCase/Defendant/Defendant.tsx',
  'src/routes/Prosecutor/RestrictionCase/HearingArrangements/ArrestDate.tsx',
  'src/routes/Prosecutor/components/DefendantInfo/DefendantInfo.spec.tsx',
  'src/routes/Prosecutor/components/DefendantInfo/DefendantInfo.tsx',
  'src/routes/Prosecutor/components/PoliceCaseNumbers/PoliceCaseNumbers.spec.tsx',
  'src/routes/Prosecutor/components/PoliceCaseNumbers/PoliceCaseNumbers.tsx',
  'src/routes/Prosecutor/components/RequestCourtDate/RequestCourtDate.tsx',
  'src/routes/PublicProsecutor/Indictments/Overview/IndictmentReviewerSelector.tsx',
  'src/routes/PublicProsecutor/Indictments/Overview/Overview.spec.tsx',
  'src/routes/PublicProsecutor/Indictments/RegisterVerdictAppeal/RegisterVerdictAppeal.spec.tsx',
  'src/routes/Shared/AddFiles/AddFiles.tsx',
  'src/routes/Shared/CaseTable/CancelCase.tsx',
  'src/routes/Shared/RouteHandler/RouteHandler.logic.ts',
  'src/routes/Shared/RouteHandler/RouteHandler.tsx',
  'src/routes/Shared/SignedVerdictOverview/Components/ModifyDatesModal/ModifyDatesModal.tsx',
  'src/routes/Shared/SignedVerdictOverview/SignedVerdictOverview.spec.tsx',
  'src/routes/Shared/SignedVerdictOverview/SignedVerdictOverview.tsx',
  'src/utils/formHelper.spec.ts',
  'src/utils/formHelper.ts',
  'src/utils/hooks/useAppealCase/index.ts',
  'src/utils/hooks/useCase/useCase.logic.spec.ts',
  'src/utils/hooks/useCase/useCase.logic.ts',
  'src/utils/hooks/useCaseList/index.tsx',
  'src/utils/hooks/useCivilClaimants/index.ts',
  'src/utils/hooks/useCourtUpload/index.ts',
  'src/utils/hooks/useDebouncedInput/index.ts',
  'src/utils/hooks/useDefendants/index.ts',
  'src/utils/hooks/useIndictmentCounts/index.ts',
  'src/utils/hooks/useSections/index.ts',
  'src/utils/hooks/useSections/useSections.spec.tsx',
  'src/utils/hooks/useTargetAppealCaseByAppealCaseId/index.ts',
  'src/utils/hooks/useTargetAppealCaseByAppealCaseId/useTargetAppealCaseByAppealCaseId.spec.ts',
  'src/utils/hooks/useTargetAppealCaseByRulingFileId/index.ts',
  'src/utils/hooks/useTargetAppealCaseByRulingFileId/useTargetAppealCaseByRulingFileId.spec.ts',
  'src/utils/hooks/useVerdict/index.ts',
  'src/utils/hooks/useVictim/index.ts',
  'src/utils/mocks.ts',
  'src/utils/testHelpers.tsx',
  'src/utils/titleForCase/titleForCase.spec.ts',
  'src/utils/titleForCase/titleForCase.ts',
  'src/utils/utils.spec.ts',
  'src/utils/utils.ts',
  'src/utils/validate.spec.ts',
  'src/utils/validate.ts',
]

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  ...compat.extends('plugin:jsx-a11y/strict'),
  {
    plugins: {
      'jsx-a11y': eslintPluginJsxA11y,
      'simple-import-sort': eslintPluginSimpleImportSort,
      import: eslintPluginImport,
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      eqeqeq: ['error', 'always'],
      'no-restricted-imports': [
        'error',
        { paths: [...restrictedImportPaths, caseSchemaTypeImport] },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            'CallExpression[callee.name=/^format(Date)?$/] > Literal[value=/^Pp?$/]',
          message:
            "Do not use the date-fns short date token 'P'/'Pp' \u2014 the Icelandic locale renders it as 'd.MM.y' (unpadded day, padded month, e.g. \"5.05.2025\"). Use an explicit padded format like 'dd.MM.y' or 'dd.MM.y HH:mm'.",
        },
      ],
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
      'import/no-relative-parent-imports': 'error',
      'import/no-duplicates': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'separate-type-imports' },
      ],
      'jsx-a11y/no-autofocus': [
        2,
        {
          ignoreNonDOM: true,
        },
      ],
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^\\w', '^@(?!island).+'],
            ['^(@island.is).*'],
            [
              '^\\.\\.(?!/?$)',
              '^\\.\\./?$',
              '^\\./(?=.*/)(?!/?$)',
              '^\\.(?!/?$)',
              '^\\./?$',
              '^.+\\.?(strings)$',
              '^.+\\.?(css)$',
            ],
          ],
        },
      ],
    },
  },
  {
    // nx runs eslint from the workspace root, so this must not be cwd-relative
    files: ['**/infra/**'],
    rules: {
      'import/no-relative-parent-imports': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
    },
  },
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx'],
    rules: {
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  {
    // Not yet moved to WorkingCase; see caseSchemaTypeAllowlist. nx runs eslint
    // from the workspace root, so the entries must not be cwd-relative.
    files: caseSchemaTypeAllowlist.map((file) => '**/' + file),
    rules: {
      'no-restricted-imports': ['error', { paths: restrictedImportPaths }],
    },
  },
  {
    ignores: ['/src/graphql/schema.tsx', '/public/**'],
  },
]
