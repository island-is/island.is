import { literal, Op } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
  VERDICT_APPEAL_WINDOW_DAYS,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions, expandCasesWithDefendants } from '../caseTable.types'
import { publicProsecutionOfficeIndictmentsAccessWhereOptions } from './access'

// Public prosecution office indictments

// The appeal window runs until midnight at the end of its last day, counted
// from the day the verdict was served (see getIndictmentAppealDeadline). A date
// is therefore still on deadline while it is at or after this cutoff, and past
// it once it is before - which keeps these lists in step with the deadline the
// case itself reports, whether or not the date carries a time of day.
// The day boundary is pinned to UTC rather than left to the database session
// time zone, so that it matches the deadline computed in Node - which also runs
// in UTC, the time zone Iceland is in all year round.
const APPEAL_WINDOW_CUTOFF = `((date_trunc('day', NOW() AT TIME ZONE 'UTC') - INTERVAL '${VERDICT_APPEAL_WINDOW_DAYS} days') AT TIME ZONE 'UTC')`

export const publicProsecutionOfficeIndictmentsNewWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: { is_closed_without_enforcement: { [Op.not]: true } },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: null },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsInReviewWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          indictment_review_decision: null,
          is_closed_without_enforcement: { [Op.not]: true },
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsReviewedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.and]: [
            { indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT },
            { is_sent_to_prison_admin: { [Op.not]: true } },
            { is_closed_without_enforcement: { [Op.not]: true } },
            {
              '$Case.indictment_ruling_decision$':
                CaseIndictmentRulingDecision.RULING,
              [Op.or]: [
                {
                  [Op.and]: [
                    {
                      '$Case.ruling_date$': {
                        [Op.gte]: literal(APPEAL_WINDOW_CUTOFF),
                      },
                    },
                    literal(`
                      EXISTS (
                        SELECT 1
                        FROM verdict
                        WHERE verdict.defendant_id = "defendants".id
                          AND verdict.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
                          AND verdict.is_acquitted_by_public_prosecution_office IS NOT TRUE
                          AND verdict.defendant_has_requested_appeal IS NOT TRUE
                          AND verdict.appeal_date IS NULL
                          AND verdict.created = (
                            SELECT MAX(v2.created)
                            FROM verdict v2
                            WHERE v2.defendant_id = "defendants".id
                          )
                      )`),
                  ],
                },
                literal(`
                  EXISTS (
                    SELECT 1
                    FROM verdict
                    WHERE verdict.defendant_id = "defendants".id
                      AND verdict.service_requirement IN ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                      AND verdict.is_acquitted_by_public_prosecution_office IS NOT TRUE
                      AND verdict.defendant_has_requested_appeal IS NOT TRUE
                      AND verdict.appeal_date IS NULL
                      AND (verdict.service_date IS NULL OR verdict.service_date >= ${APPEAL_WINDOW_CUTOFF})
                      AND verdict.created = (
                        SELECT MAX(v2.created)
                        FROM verdict v2
                        WHERE v2.defendant_id = "defendants".id
                      )
                  )`),
              ],
            },
          ],
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsAppealPeriodExpiredWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.and]: [
            { indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT },
            { is_sent_to_prison_admin: { [Op.not]: true } },
            { is_closed_without_enforcement: { [Op.not]: true } },
            {
              [Op.or]: [
                {
                  '$Case.indictment_ruling_decision$':
                    CaseIndictmentRulingDecision.FINE,
                },
                {
                  [Op.and]: [
                    {
                      '$Case.ruling_date$': {
                        [Op.lt]: literal(APPEAL_WINDOW_CUTOFF),
                      },
                    },
                    literal(`
                      EXISTS (
                        SELECT 1
                        FROM verdict
                        WHERE verdict.defendant_id = "defendants".id
                          AND verdict.service_requirement = '${ServiceRequirement.NOT_REQUIRED}'
                          AND verdict.is_acquitted_by_public_prosecution_office IS NOT TRUE
                          AND verdict.defendant_has_requested_appeal IS NOT TRUE
                          AND verdict.appeal_date IS NULL
                          AND verdict.created = (
                            SELECT MAX(v2.created)
                            FROM verdict v2
                            WHERE v2.defendant_id = "defendants".id
                          )
                      )`),
                  ],
                },
                literal(`
                  EXISTS (
                    SELECT 1
                    FROM verdict
                    WHERE verdict.defendant_id = "defendants".id
                      AND verdict.service_requirement IN ('${ServiceRequirement.REQUIRED}', '${ServiceRequirement.NOT_APPLICABLE}')
                      AND verdict.is_acquitted_by_public_prosecution_office IS NOT TRUE
                      AND verdict.defendant_has_requested_appeal IS NOT TRUE
                      AND verdict.appeal_date IS NULL
                      AND verdict.service_date < ${APPEAL_WINDOW_CUTOFF}
                      AND verdict.created = (
                        SELECT MAX(v2.created)
                        FROM verdict v2
                        WHERE v2.defendant_id = "defendants".id
                      )
                  )`),
              ],
            },
          ],
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        {
          indictment_reviewer_id: { [Op.not]: null },
          indictment_ruling_decision: [
            CaseIndictmentRulingDecision.RULING,
            CaseIndictmentRulingDecision.FINE,
          ],
        },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsSentToPrisonAdminWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
          is_sent_to_prison_admin: true,
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsAppealedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.and]: [
            { is_closed_without_enforcement: { [Op.not]: true } },
            {
              [Op.or]: [
                {
                  indictment_review_decision:
                    IndictmentCaseReviewDecision.APPEAL,
                },
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
          ],
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsAcquittedWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          indictment_review_decision: IndictmentCaseReviewDecision.ACCEPT,
          is_closed_without_enforcement: { [Op.not]: true },
          [Op.and]: [
            literal(`EXISTS (
              SELECT 1
              FROM verdict
              WHERE verdict.defendant_id = defendants.id
                AND verdict.is_acquitted_by_public_prosecution_office = TRUE
                AND verdict.appeal_date IS NULL
                AND verdict.created = (
                    SELECT MAX(v2.created)
                    FROM verdict v2
                    WHERE v2.defendant_id = defendants.id
                )
            )`),
          ],
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsClosedWithoutEnforcementWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: { is_closed_without_enforcement: true },
      },
    },
    where: publicProsecutionOfficeIndictmentsAccessWhereOptions,
    displayCases: expandCasesWithDefendants,
  })

export const publicProsecutionOfficeIndictmentsRequestedAppealWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.and]: [
            { is_closed_without_enforcement: { [Op.not]: true } },
            literal(`EXISTS (
              SELECT 1
              FROM verdict
              WHERE verdict.defendant_id = defendants.id
                AND verdict.defendant_has_requested_appeal = TRUE
                AND verdict.appeal_date IS NULL
                AND verdict.created = (
                    SELECT MAX(v2.created)
                    FROM verdict v2
                    WHERE v2.defendant_id = defendants.id
                )
            )`),
          ],
        },
      },
    },
    where: {
      [Op.and]: [
        publicProsecutionOfficeIndictmentsAccessWhereOptions,
        { indictment_reviewer_id: { [Op.not]: null } },
      ],
    },
    displayCases: expandCasesWithDefendants,
  })
