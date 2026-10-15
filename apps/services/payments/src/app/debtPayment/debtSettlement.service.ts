import { Op, literal } from 'sequelize'

import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/sequelize'

import type { ProblemDetailsDt } from '@island.is/clients/finance-v3'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { retry } from '@island.is/shared/utils/server'

import { FjsPayInfo, toFjsDebtPayInfo } from '../../utils/fjsDebtPayment'
import {
  FjsDebtPayment,
  FjsDebtPaymentAttributes,
  PaymentFlowEvent,
} from '../paymentFlow/models'
import { DebtFjsService } from './debtFjs.service'
import type { DebtFjsDebt } from './debtFjs.types'

/** The call to FJS ends well inside the 60s step timeout of the payment sagas. */
const PAY_DEBT_TIMEOUT_MS = 15_000

/**
 * An attempt is claimed for this long. It keeps concurrent callers (the saga, a status poll, the
 * worker) from calling `payDebt` for the same flow at the same time, so it must outlast one
 * attempt: `payDebt` (15s) plus saving its outcome.
 */
export const ATTEMPT_CLAIM_WINDOW_MS = 60_000

export type DebtSettlementFlow = {
  id: string
  payerNationalId: string
  debts?: DebtFjsDebt[]
}

export type DebtSettlementResult = (
  | {
      type: 'registered'
      /** Missing when the 202 was lost and FJS only reported the payment as a duplicate. */
      dateCreated?: string
    }
  /** FJS rejected the payment, the flow is closed and the caller decides how to unwind it. */
  | { type: 'rejected'; problem?: ProblemDetailsDt }
  /**
   * A rejection after an ambiguous attempt, or FJS reporting a payment no attempt explains: may be
   * registered already, needs a person.
   */
  | { type: 'reconcile'; problem?: ProblemDetailsDt }
) & {
  /** True when the flow was settled by an earlier attempt, nothing happened on this call. */
  alreadySettled: boolean
}

export type DebtSettlementOutcome =
  | DebtSettlementResult
  /** Not settled yet, the worker tries again. `reason` is for logs and worker events. */
  | {
      type: 'deferred'
      reason: 'in_progress' | 'busy' | 'ambiguous' | 'transient'
    }

/**
 * Registers a captured debt payment with FJS (`payDebt`). Shared by the payment flows, which
 * call it right after the money is captured, and by the worker, which retries what is left.
 *
 * The state is the `fjs_debt_payment` row, one per flow:
 * pending -> registered | rejected | needs_reconciliation. The last three are final.
 */
@Injectable()
export class DebtSettlementService {
  constructor(
    @InjectModel(FjsDebtPayment)
    private readonly fjsDebtPaymentModel: typeof FjsDebtPayment,
    @InjectModel(PaymentFlowEvent)
    private readonly paymentFlowEventModel: typeof PaymentFlowEvent,
    private readonly debtFjsService: DebtFjsService,
    @Inject(LOGGER_PROVIDER) private readonly logger: Logger,
  ) {}

  /**
   * One attempt at registering the payment, with no retry loop: callers that wait on it are
   * inside a saga step that rolls back, and refunds the card, when it times out.
   */
  async attempt(
    flow: DebtSettlementFlow,
    payInfo: FjsPayInfo,
  ): Promise<DebtSettlementOutcome> {
    const debts = flow.debts ?? []
    const amount = debts.reduce((sum, debt) => sum + debt.amount, 0)

    await this.fjsDebtPaymentModel.findOrCreate({
      where: { paymentFlowId: flow.id },
      defaults: {
        paymentFlowId: flow.id,
        status: 'pending',
        attempts: 0,
        hadAmbiguousAttempt: false,
        amount,
      },
    })

    const row = await this.claimAttempt(flow.id)
    if (!row) {
      return this.currentOutcome(flow.id)
    }

    // No validatePayment first: payDebt answers with the same error codes, including the
    // duplicate (6) that tells an earlier attempt registered the payment. The payment flows
    // validated the debts right before the money was captured.
    const paymentDate = new Date()

    // Until the outcome is saved the call counts as ambiguous, so a crash or a failed write after a
    // 202 can not make a later 400 look like a clean rejection and refund a registered payment.
    // If this write fails nothing has been sent to FJS, and throwing is safe.
    await this.fjsDebtPaymentModel.update(
      { hadAmbiguousAttempt: true },
      { where: { paymentFlowId: flow.id, status: 'pending' } },
    )

    const outcome = await this.debtFjsService.pay({
      flowId: flow.id,
      payerNationalId: flow.payerNationalId,
      debts,
      paymentDate,
      payInfo: toFjsDebtPayInfo(payInfo),
      timeoutMs: PAY_DEBT_TIMEOUT_MS,
    })

    switch (outcome.type) {
      case 'registered': {
        await this.persistAfterPay(flow.id, {
          status: 'registered',
          dateCreated: outcome.dateCreated,
          paymentDate,
          // This call's outcome is known, only earlier attempts can leave the flag set
          hadAmbiguousAttempt: row.hadAmbiguousAttempt,
        })
        return {
          type: 'registered',
          dateCreated: outcome.dateCreated,
          alreadySettled: false,
        }
      }

      case 'rejected':
        // A 400 after an ambiguous attempt could be a duplicate of that attempt.
        return row.hadAmbiguousAttempt
          ? this.markNeedsReconciliation(flow.id, outcome.problem)
          : this.markRejected(flow.id, outcome.problem)

      case 'already_registered':
        return this.onAlreadyRegistered(row, outcome.problem)

      case 'ambiguous':
        // FJS may have processed the call, so a later 400 can not be trusted.
        await this.persistAfterPay(flow.id, {
          hadAmbiguousAttempt: true,
          lastError: this.describeError(outcome.error),
        })
        this.logger.warn(
          `[${flow.id}] payDebt outcome unknown, the worker will retry`,
          { error: (outcome.error as Error)?.message },
        )
        return { type: 'deferred', reason: 'ambiguous' }

      case 'busy':
        // FJS is processing another payment for these debts and did not take this one.
        await this.persistAfterPay(flow.id, {
          hadAmbiguousAttempt: row.hadAmbiguousAttempt,
          lastError: outcome.problem ?? {},
        })
        this.logger.warn(
          `[${flow.id}] FJS is processing another payment for these debts, the worker will retry`,
          { problemType: outcome.problem?.type },
        )
        return { type: 'deferred', reason: 'busy' }

      case 'transient':
        // FJS did not process the call, so the flag goes back to what earlier attempts left.
        await this.persistAfterPay(flow.id, {
          hadAmbiguousAttempt: row.hadAmbiguousAttempt,
          lastError: this.describeError(outcome.error),
        })
        this.logger.error(`[${flow.id}] payDebt not processed by FJS`, {
          error: (outcome.error as Error)?.message,
        })
        return { type: 'deferred', reason: 'transient' }
    }
  }

  /**
   * Saves what came of the `payDebt` call. This must not throw: the callers act on an error by
   * refunding the card, which would be wrong for a payment FJS may have registered. A write that
   * still fails after retries is alerted on.
   */
  private async persistAfterPay(
    paymentFlowId: string,
    values: Partial<FjsDebtPaymentAttributes>,
  ): Promise<boolean> {
    try {
      await retry(
        () =>
          this.fjsDebtPaymentModel.update(values, {
            where: { paymentFlowId, status: 'pending' },
          }),
        {
          maxRetries: 3,
          retryDelayMs: 500,
          logger: this.logger,
          logPrefix: `[${paymentFlowId}] Save debt payment state`,
        },
      )
      return true
    } catch (error) {
      this.logger.error(
        `[${paymentFlowId}] CRITICAL: could not save the state of a debt payment call to FJS — check FJS and reconcile manually`,
        { needsReconciliation: true, values, error: (error as Error)?.message },
      )
      return false
    }
  }

  /**
   * Takes the attempt if the row is pending and no other attempt started recently, in one
   * statement so that concurrent callers can not both get it.
   */
  private async claimAttempt(
    paymentFlowId: string,
  ): Promise<FjsDebtPayment | null> {
    const [count, rows] = await this.fjsDebtPaymentModel.update(
      { attempts: literal('attempts + 1') as never, lastAttemptAt: new Date() },
      {
        where: {
          paymentFlowId,
          status: 'pending',
          [Op.or]: [
            { lastAttemptAt: null },
            {
              lastAttemptAt: {
                [Op.lt]: new Date(Date.now() - ATTEMPT_CLAIM_WINDOW_MS),
              },
            },
          ],
        },
        returning: true,
      },
    )

    return count > 0 ? rows[0] : null
  }

  /** What to report when no attempt could be claimed. */
  private async currentOutcome(
    paymentFlowId: string,
  ): Promise<DebtSettlementOutcome> {
    const row = await this.fjsDebtPaymentModel.findOne({
      where: { paymentFlowId },
    })
    const problem = row?.lastError as ProblemDetailsDt | undefined

    switch (row?.status) {
      case 'registered':
        return {
          type: 'registered',
          dateCreated: row.dateCreated ?? undefined,
          alreadySettled: true,
        }
      case 'rejected':
        return { type: 'rejected', problem, alreadySettled: true }
      case 'needs_reconciliation':
        return { type: 'reconcile', problem, alreadySettled: true }
      default:
        return { type: 'deferred', reason: 'in_progress' }
    }
  }

  /**
   * FJS already has a payment with this payFlowId. The flow id is ours alone, so after an attempt
   * with an unknown outcome that attempt was registered. Without one nothing explains it, and a
   * person has to look. Never a refund either way.
   *
   * `row` is the claimed row, so its flag is what earlier attempts left.
   */
  private async onAlreadyRegistered(
    row: FjsDebtPayment,
    problem?: ProblemDetailsDt,
  ): Promise<DebtSettlementOutcome> {
    if (!row.hadAmbiguousAttempt) {
      return this.markNeedsReconciliation(row.paymentFlowId, problem)
    }

    this.logger.warn(
      `[${row.paymentFlowId}] FJS already has the debt payment, an earlier attempt registered it`,
      { problem },
    )
    // FJS does not repeat `dateCreated`, so it stays empty
    await this.persistAfterPay(row.paymentFlowId, {
      status: 'registered',
      hadAmbiguousAttempt: true,
    })
    return {
      type: 'registered',
      alreadySettled: false,
    }
  }

  private async markRejected(
    paymentFlowId: string,
    problem?: ProblemDetailsDt,
  ): Promise<DebtSettlementOutcome> {
    const [count] = await this.fjsDebtPaymentModel.update(
      // Only reached when no earlier attempt was ambiguous, see the callers
      {
        status: 'rejected',
        hadAmbiguousAttempt: false,
        lastError: problem ?? {},
      },
      { where: { paymentFlowId, status: 'pending' } },
    )

    if (count === 0) {
      return this.currentOutcome(paymentFlowId)
    }

    this.logger.warn(`[${paymentFlowId}] FJS rejected the debt payment`, {
      problem,
    })
    return { type: 'rejected', problem, alreadySettled: false }
  }

  /**
   * Written to the event table directly: `logPaymentFlowUpdate` would send the organisation a
   * webhook about an internal matter, and the payment is still completed from its point of view.
   */
  private async markNeedsReconciliation(
    paymentFlowId: string,
    problem?: ProblemDetailsDt,
  ): Promise<DebtSettlementOutcome> {
    const [count] = await this.fjsDebtPaymentModel
      .update(
        { status: 'needs_reconciliation', lastError: problem ?? {} },
        { where: { paymentFlowId, status: 'pending' } },
      )
      // Throwing would send the caller to a refund, which is the one thing not to do here
      .catch((error) => {
        this.logger.error(
          `[${paymentFlowId}] Failed to save needs_reconciliation`,
          { error: (error as Error)?.message },
        )
        return [1]
      })

    if (count === 0) {
      return this.currentOutcome(paymentFlowId)
    }

    this.logger.error(
      `[${paymentFlowId}] CRITICAL: FJS rejected a debt payment that may already be registered — reconcile manually, do not refund`,
      { needsReconciliation: true, problem },
    )

    await this.paymentFlowEventModel
      .create({
        paymentFlowId,
        type: 'error',
        reason: 'other',
        paymentMethod: 'system',
        occurredAt: new Date(),
        message:
          'FJS rejected a debt payment that may already be registered — reconcile manually',
        metadata: { needsReconciliation: true, problem },
      })
      .catch((error) => {
        this.logger.error(
          `[${paymentFlowId}] Failed to persist the reconciliation event`,
          { needsReconciliation: true, error: (error as Error)?.message },
        )
      })

    return { type: 'reconcile', problem, alreadySettled: false }
  }

  private describeError(error: unknown): object {
    const e = error as { name?: string; message?: string; status?: number }
    return { name: e?.name, message: e?.message, status: e?.status }
  }
}
