import { literal, Op } from 'sequelize'

import {
  CaseIndictmentRulingDecision,
  IndictmentCaseReviewDecision,
  ServiceRequirement,
} from '@island.is/judicial-system/types'

import { CaseWhereOptions, expandCasesWithDefendants } from '../caseTable.types'
import { publicProsecutionOfficeIndictmentsAccessWhereOptions } from './access'

// Public prosecution office indictments

export const publicProsecutionOfficeIndictmentsNewWhereOptions =
  (): CaseWhereOptions => ({
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
        where: { indictment_review_decision: null },
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
            {
              [Op.or]: [
                {
                  '$Case.indictment_ruling_decision$':
                    CaseIndictmentRulingDecision.FINE,
                },
                {
                  '$Case.indictment_ruling_decision$':
                    CaseIndictmentRulingDecision.RULING,
                  [Op.or]: [
                    {
                      [Op.and]: [
                        {
                          '$Case.ruling_date$': {
                            [Op.gt]: literal(`NOW() - INTERVAL '29 days'`),
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
                          AND (verdict.service_date IS NULL OR verdict.service_date + INTERVAL '29 days' > NOW())
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
            {
              [Op.or]: [
                {
                  [Op.and]: [
                    {
                      '$Case.ruling_date$': {
                        [Op.lt]: literal(`NOW() - INTERVAL '29 days'`),
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
          indictment_ruling_decision: CaseIndictmentRulingDecision.RULING,
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

export const publicProsecutionOfficeIndictmentsRequestedAppealWhereOptions =
  (): CaseWhereOptions => ({
    includes: {
      defendants: {
        attributes: [],
        required: true,
        where: {
          [Op.and]: [
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
