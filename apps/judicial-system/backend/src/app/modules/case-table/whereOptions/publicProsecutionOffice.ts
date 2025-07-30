import { fn, literal, Op, where } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { publicProsecutionOfficeIndictmentsAccessWhereOptions } from './access'
import { buildIsSentToPrisonExistsCondition } from './conditions'

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
      indictment_review_decision: null,
    },
  ],
})

export const publicProsecutionOfficeIndictmentsReviewedWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    {
      indictment_reviewer_id: { [Op.not]: null },
      indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
      [Op.or]: [
        {
          indictment_ruling_decision: CaseIndictmentRulingDecision.FINE,
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              WHERE defendant.case_id = "Case".id
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
            )`),
          ],
        },
        {
          indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              WHERE defendant.case_id = "Case".id
                AND defendant.verdict_appeal_date IS NULL
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                AND defendant.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
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
              WHERE defendant.case_id = "Case".id
                AND defendant.verdict_appeal_date IS NULL
                AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                AND defendant.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                AND (
                  defendant.verdict_view_date IS NULL
                  OR defendant.verdict_view_date + INTERVAL '29 days' > NOW()
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
        indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
        [Op.and]: [
          { indictment_ruling_decision: CaseIndictmentRulingDecision.RULING },
          {
            [Op.not]: {
              [Op.and]: [
                literal(`EXISTS (
                  SELECT 1 FROM defendant
                  WHERE defendant.case_id = "Case".id
                    AND defendant.verdict_appeal_date IS NULL
                    AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                    AND defendant.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
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
                  WHERE defendant.case_id = "Case".id
                    AND defendant.verdict_appeal_date IS NULL
                    AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
                    AND defendant.service_requirement in ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                    AND (
                      defendant.verdict_view_date IS NULL
                      OR defendant.verdict_view_date + INTERVAL '29 days' > NOW()
                    )
                )`),
              ],
            },
          },
          {
            [Op.and]: [
              literal(`EXISTS (
                SELECT 1 FROM defendant
                WHERE defendant.case_id = "Case".id
                  AND defendant.verdict_appeal_date IS NULL
                  AND (defendant.is_sent_to_prison_admin IS NULL or defendant.is_sent_to_prison_admin = false)
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
        indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
        [Op.and]: [buildIsSentToPrisonExistsCondition(true)],
      },
    ],
  })

export const publicProsecutionOfficeIndictmentsAppealedWhereOptions = () => ({
  [Op.and]: [
    publicProsecutionOfficeIndictmentsAccessWhereOptions,
    {
      indictment_reviewer_id: { [Op.not]: null },
      [Op.or]: [
        { indictment_review_decision: IndictmentCaseReviewDecision.APPEAL },
        {
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 FROM defendant
              WHERE defendant.case_id = "Case".id
                AND defendant.verdict_appeal_date IS NOT NULL
            )`),
          ],
        },
      ],
    },
  ],
})
