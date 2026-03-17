import { fn, literal, Op, where } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions } from '../caseTable.types'
import { publicProsecutionOfficeIndictmentsAccessWhereOptions } from './access'
import { buildIsSentToPrisonAdminExistsCondition } from './conditions'

// Public prosecution office indictments

export const publicProsecutionOfficeIndictmentsNewWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: null },
      ],
    },
  })

export const publicProsecutionOfficeIndictmentsInReviewWhereOptions =
  (): CaseWhereOptions => ({
    includes: { defendants: { attributes: [] } },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        {
          indictment_reviewer_id: { [Op.not]: null },
          '$defendants.indictment_review_decision$': null,
        },
      ],
    },
  })

export const publicProsecutionOfficeIndictmentsReviewedWhereOptions =
  (): CaseWhereOptions => ({
    where: {
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
                AND defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.ACCEPT}'
                AND (defendant.is_sent_to_prison_admin IS NULL OR defendant.is_sent_to_prison_admin = false)
                AND verdict.is_acquitted_by_public_prosecution_office = true
                AND verdict.appeal_date IS NULL
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
    },
  })

export const publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions =
  (): CaseWhereOptions => ({
    where: {
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
    },
  })

export const publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        {
          indictment_reviewer_id: { [Op.not]: null },
          [Op.and]: [buildIsSentToPrisonAdminExistsCondition(true)],
        },
      ],
    },
  })

export const publicProsecutionOfficeIndictmentsAppealedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.or]: [
            { indictment_review_decision: IndictmentCaseReviewDecision.APPEAL },
            literal(`EXISTS (
              SELECT 1
              FROM verdict
              WHERE verdict.defendant_id = "defendants".id
                AND verdict.appeal_date IS NOT NULL
                AND verdict.created = (
                  SELECT MAX(v2.created)
                  FROM verdict v2
                  WHERE v2.defendant_id = "defendants".id
                )
            )`),
          ],
        },
        includes: { verdicts: { attributes: [] } },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
  })

// export const publicProsecutionOfficeIndictmentsAppealedWhereOptions =
//   (): CaseWhereOptions => ({
//     includes: { defendants: { attributes: [] } },
//     where: {
//       [Op.and]: [
//         publicProsecutionOfficeIndictmentsAccessWhereOptions,
//         {
//           indictment_reviewer_id: { [Op.not]: null },
//           [Op.and]: [
//             literal(`EXISTS (
//               SELECT 1
//               FROM defendant
//               JOIN verdict ON defendant.id = verdict.defendant_id
//               WHERE verdict.case_id = "Case".id
//                 AND (verdict.appeal_date IS NOT NULL
//                 OR defendant.indictment_review_decision = '${IndictmentCaseReviewDecision.APPEAL}')
//                 AND verdict.created = (
//                     SELECT MAX(v2.created)
//                     FROM verdict v2
//                     WHERE v2.defendant_id = defendant.id
//                 )
//           )`),
//           ],
//         },
//       ],
//     },
//   })

export const publicProsecutionOfficeIndictmentsAcquittedWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        {
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 
              FROM verdict
              JOIN defendant ON verdict.defendant_id = defendant.id
              WHERE defendant.case_id = "Case".id
                AND (verdict.is_acquitted_by_public_prosecution_office = true)
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
  })

export const publicProsecutionOfficeIndictmentsRequestedAppealWhereOptions =
  (): CaseWhereOptions => ({
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        {
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1 
              FROM verdict
              JOIN defendant ON verdict.defendant_id = defendant.id
              WHERE defendant.case_id = "Case".id
                AND (verdict.defendant_has_requested_appeal = true)
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
  })
