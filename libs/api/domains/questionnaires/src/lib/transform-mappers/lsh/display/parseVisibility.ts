import {
  VisibilityCondition,
  VisibilityOperator,
} from '../../../../models/question.model'

// Parse a raw LSH visibility expression into a list of simple conditions
export const parseVisibility = (
  expr: string | null,
  dependsOn?: string[] | null,
): VisibilityCondition[] | undefined => {
  // If empty expression but has dependencies, create existence conditions
  if (!expr || expr.toLowerCase() === 'true' || expr.trim() === '') {
    if (dependsOn && dependsOn.length > 0) {
      return dependsOn.map((questionId) => ({
        questionId,
        operator: VisibilityOperator.exists,
        expectedValues: undefined,
        showWhenMatched: true,
      }))
    }
    return undefined
  }

  // Collected, normalized conditions extracted from the expression
  const conditions: VisibilityCondition[] = []

  try {
    // Keep a mutable copy of the expression so we can strip out
    // each recognized pattern as we convert it into conditions
    let remainingExpr = expr

    // Pattern 1: not(isSelected('value', @@@questionId)) or not(isSelected(number, @@@questionId))
    // Negation: question should be hidden when the value is selected
    // Handle single-quoted strings (can contain parentheses)
    const notIsSelectedQuotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*'([^']+)'\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g
    let match

    while ((match = notIsSelectedQuotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false, // This means: hide when the value matches
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Handle double-quoted strings
    const notIsSelectedDoubleQuotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*"([^"]+)"\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g

    while (
      (match = notIsSelectedDoubleQuotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Fallback for unquoted values (typically numbers)
    const notIsSelectedUnquotedPattern =
      /not\s*\(\s*isSelected\s*\(\s*([^'",\s)]+)\s*,\s*@@@([a-zA-Z0-9_-]+)\s*\)\s*\)/g

    while (
      (match = notIsSelectedUnquotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: false,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 2: isSelected('value', @@@questionId) or isSelected(number, @@@questionId)
    // Positive selection: question should be shown when the value is selected
    // First try quoted string pattern (handles values with parentheses inside)
    const isSelectedQuotedPattern =
      /isSelected\s*\(\s*'([^']+)'\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while ((match = isSelectedQuotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Also handle double-quoted strings
    const isSelectedDoubleQuotedPattern =
      /isSelected\s*\(\s*"([^"]+)"\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while (
      (match = isSelectedDoubleQuotedPattern.exec(remainingExpr)) !== null
    ) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Fallback for unquoted numeric values: isSelected(123, @@@questionId)
    const isSelectedUnquotedPattern =
      /isSelected\s*\(\s*([^'",\s)]+)\s*,\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*\)/g

    while ((match = isSelectedUnquotedPattern.exec(remainingExpr)) !== null) {
      const expectedValue = match[1].trim()
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [expectedValue],
        showWhenMatched: true,
      })
      // Remove this match from remaining expression
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 3: Simple equality '@@@questionId' == 'value' or 'value' == '@@@questionId'
    const equalityPattern =
      /['"]?@@@([a-zA-Z0-9_-]+)['"]?\s*==\s*['"]([^'"]+)['"]/g

    while ((match = equalityPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[1],
        operator: VisibilityOperator.equals,
        expectedValues: [match[2]],
        showWhenMatched: true,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 3b: Reverse equality 'value' == '@@@questionId'
    const reverseEqualityPattern =
      /['"]([^'"]+)['"]\s*==\s*['"]?@@@([a-zA-Z0-9_-]+)['"]?/g

    while ((match = reverseEqualityPattern.exec(remainingExpr)) !== null) {
      conditions.push({
        questionId: match[2],
        operator: VisibilityOperator.equals,
        expectedValues: [match[1]],
        showWhenMatched: true,
      })
      remainingExpr = remainingExpr.replace(match[0], '')
    }

    // Pattern 4: Complex logical expressions with && and ||
    // Example: "@@@Totalscore >=20 && @@@Totalscore <=24"
    const complexLogicalPattern = /(.+?)\s*(&&|\|\|)\s*(.+)/
    const complexMatch = complexLogicalPattern.exec(remainingExpr)

    if (complexMatch) {
      const leftExpr = complexMatch[1].trim()
      const logicalOp = complexMatch[2]
      const rightExpr = complexMatch[3].trim()

      // Recursively parse left and right expressions separately
      const leftConditions = parseVisibility(leftExpr) || []
      const rightConditions = parseVisibility(rightExpr) || []

      // For && operations, we need ALL conditions to be true (AND logic)
      // For || operations, we need ANY condition to be true (OR logic)
      // Since our current system uses AND logic by default, we can combine them
      if (logicalOp === '&&') {
        conditions.push(...leftConditions, ...rightConditions)
      } else if (logicalOp === '||') {
        // For OR logic, we'd need a different approach
        // For now, let's treat it as AND since that's what our evaluation supports
        conditions.push(...leftConditions, ...rightConditions)
      }

      // Clear the remaining expression since we processed the whole thing
      remainingExpr = ''
    } else {
      // Pattern 5: Single mathematical comparisons - handle quoted and unquoted forms
      // Matches: '@@@Q6'>'4', @@@Q6>4, '@@@Q6'>='4', @@@Q6>=4, etc.
      const mathPatterns = [
        {
          // Quoted form: '@@@questionId' operator 'value'
          regex:
            /['"]@@@([a-zA-Z0-9_-]+)['"]\s*(>=|<=|>|<|==|!=)\s*['"](\d+(?:\.\d+)?)['"]/g,
          op: 'comparison',
        },
        {
          // Unquoted form: @@@questionId operator value
          regex: /@@@([a-zA-Z0-9_-]+)\s*(>=|<=|>|<|==|!=)\s*(\d+(?:\.\d+)?)/g,
          op: 'comparison',
        },
        {
          // Variable comparison (unquoted): @@@questionId operator @@@otherQuestionId
          regex:
            /@@@([a-zA-Z0-9_-]+)\s*(>=|<=|>|<|==|!=)\s*@@@([a-zA-Z0-9_-]+)/g,
          op: 'variable_comparison',
        },
      ]

      for (const pattern of mathPatterns) {
        let mathMatch
        while ((mathMatch = pattern.regex.exec(remainingExpr)) !== null) {
          const operator = mathMatch[2]
          const value =
            pattern.op === 'variable_comparison' ? mathMatch[3] : mathMatch[3]

          // Map comparison operators to our visibility operators
          let visibilityOp = VisibilityOperator.equals
          const expectedVal = value
          let showWhen = true

          switch (operator) {
            case '>':
              visibilityOp = VisibilityOperator.greaterThan
              break
            case '>=':
              visibilityOp = VisibilityOperator.greaterThanOrEqual
              break
            case '<':
              visibilityOp = VisibilityOperator.lessThan
              break
            case '<=':
              visibilityOp = VisibilityOperator.lessThanOrEqual
              break
            case '==':
              visibilityOp = VisibilityOperator.equals
              break
            case '!=':
              visibilityOp = VisibilityOperator.equals
              showWhen = false
              break
          }

          conditions.push({
            questionId: mathMatch[1],
            operator: visibilityOp,
            expectedValues: [expectedVal],
            showWhenMatched: showWhen,
          })

          remainingExpr = remainingExpr.replace(mathMatch[0], '')
        }
      }
    }

    // Pattern 6: Fallback existence check for any remaining question references
    if (conditions.length === 0 && remainingExpr.includes('@@@')) {
      const dependencyPattern = /@@@([a-zA-Z0-9_-]+)/g
      let depMatch
      while ((depMatch = dependencyPattern.exec(remainingExpr)) !== null) {
        conditions.push({
          questionId: depMatch[1],
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    }
  } catch (error) {
    console.warn('Error parsing visibility expression:', expr, error)
  }

  // Also add explicit dependencies from dependsOn array if not already captured
  if (dependsOn && dependsOn.length > 0) {
    const existingQuestionIds = new Set(conditions.map((c) => c.questionId))

    dependsOn.forEach((questionId) => {
      if (!existingQuestionIds.has(questionId)) {
        conditions.push({
          questionId,
          operator: VisibilityOperator.exists,
          expectedValues: undefined,
          showWhenMatched: true,
        })
      }
    })
  }

  // Deduplicate conditions so the evaluator does not see duplicates
  const uniqueConditions = conditions.filter((condition, index, self) => {
    return (
      index ===
      self.findIndex(
        (c) =>
          c.questionId === condition.questionId &&
          c.operator === condition.operator &&
          c.expectedValues === condition.expectedValues &&
          c.showWhenMatched === condition.showWhenMatched,
      )
    )
  })

  return uniqueConditions.length > 0 ? uniqueConditions : undefined
}
