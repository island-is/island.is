import { fn, literal, Op, where } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { publicProsecutionOfficeIndictmentsAccessWhereOptions } from './access'
import {
  buildHasDefendantWithNullReviewDecisionCondition,
  buildIsSentToPrisonExistsCondition,
} from './conditions'

// Public prosecution office indictments

export const publicProsecutionOfficeIndictmentsNewWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    { indictment_reviewer_id: null },
  ],
})

export const publicProsecutionOfficeIndictmentsInReviewWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    {
      indictment_reviewer_id: { [Op.not]: null },
    },
    buildHasDefendantWithNullReviewDecisionCondition(true),
  ],
})

export const publicProsecutionOfficeIndictmentsReviewedWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    {
      indictment_reviewer_id: { [Op.not]: null },
      [Op.or]: [
        {
          indictment_ruling_decision: CaseIndictmentRulingDecision.FINE,
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              WHERE defendant.case_id = "Case".id
                AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
            )`),
          ],
        },
        {
          indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              JOIN verdict ON defendant.id = verdict.defendant_id
              WHERE defendant.case_id = "Case".id
                AND verdict.appeal_date IS NULL
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                AND verdict.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
                AND verdict.created = (
                    SELECT MAX(v2.created)
                    FROM verdict v2
                    WHERE v2.defendant_id = defendant.id
                )
            )`),
            where(
              literal(`"ruling_date"::date + INTERVAL '29 days'`),
              Op.gt,
              fn('NOW'),
            ),
          ],
        },
        {
          indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              JOIN verdict ON defendant.id = verdict.defendant_id
              WHERE defendant.case_id = "Case".id
                AND verdict.appeal_date IS NULL
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                AND verdict.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                AND (
                  verdict.service_date IS NULL
                  OR verdict.service_date + INTERVAL '29 days' > NOW()
                )
                AND verdict.created = (
                    SELECT MAX(v2.created)
                    FROM verdict v2
                    WHERE v2.defendant_id = defendant.id
                )
            )`),
          ],
        },
      ],
    },
  ],
})

export const publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions =
  () => ({
    [Op.and]: [
      publicProsecutionOfficeIndictmentsAccessWhereOptions,
      {
        indictment_reviewer_id: { [Op.not]: null },
        [Op.and]: [
          { indictment_ruling_decision: CaseIndictmentRulingDecision.RULING },
          {
            [Op.not]: {
              [Op.and]: [
                literal(`EXISTS (
                  SELECT 1 FROM defendant
                  JOIN verdict ON defendant.id = verdict.defendant_id
                  WHERE defendant.case_id = "Case".id
                    AND verdict.appeal_date IS NULL
                    AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                    AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                    AND verdict.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
                    AND verdict.created = (
                        SELECT MAX(v2.created)
                        FROM verdict v2
                        WHERE v2.defendant_id = defendant.id
                    )
                )`),
                where(
                  literal(`"ruling_date"::date + INTERVAL '29 days'`),
                  Op.gt,
                  fn('NOW'),
                ),
              ],
            },
          },
          {
            [Op.not]: {
              [Op.and]: [
                literal(`EXISTS (
                  SELECT 1 FROM defendant
                  JOIN verdict ON defendant.id = verdict.defendant_id
                  WHERE defendant.case_id = "Case".id
                    AND verdict.appeal_date IS NULL
                    AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                    AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                    AND verdict.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                    AND (
                      verdict.service_date IS NULL
                      OR verdict.service_date + INTERVAL '29 days' > NOW()
                    )
                    AND verdict.created = (
                        SELECT MAX(v2.created)
                        FROM verdict v2
                        WHERE v2.defendant_id = defendant.id
                    )
                )`),
              ],
            },
          },
          {
            [Op.and]: [
              literal(`EXISTS (
                SELECT 1 FROM defendant
                JOIN verdict ON defendant.id = verdict.defendant_id
                WHERE defendant.case_id = "Case".id
                  AND verdict.appeal_date IS NULL
                  AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                  AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                  AND verdict.created = (
                      SELECT MAX(v2.created)
                      FROM verdict v2
                      WHERE v2.defendant_id = defendant.id
                  )
              )`),
            ],
          },
        ],
      },
    ],
  })

export const publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions =
  () => ({
    [Op.and]: [
      publicProsecutionOfficeIndictmentsAccessWhereOptions,
      {
        indictment_reviewer_id: { [Op.not]: null },
        [Op.and]: [buildIsSentToPrisonExistsCondition(true)],
      },
    ],
  })

export const publicProsecutionOfficeIndictmentsAppealedWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    {
      indictment_reviewer_id: { [Op.not]: null },
      [Op.and]: [
        literal(`EXISTS (
              SELECT 1 
              FROM defendant
              JOIN verdict ON defendant.id = verdict.defendant_id
              WHERE verdict.case_id = "Case".id
                AND (verdict.appeal_date IS NOT NULL 
                OR defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.APPEAL}')
                AND verdict.created = (
                    SELECT MAX(v2.created)
                    FROM verdict v2
                    WHERE v2.defendant_id = defendant.id
                )
          )`),
      ],
    },
  ],
})
