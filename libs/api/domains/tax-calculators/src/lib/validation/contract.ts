import type {
  CalculatorContract,
  CalculatorField,
  CalculatorKey,
  CalculatorOutputField,
  CalculatorScalarOutputField,
} from '@island.is/clients/rsk/calculators'

/* A bare Error, surfacing to a consumer as an unqualified
 * INTERNAL_SERVER_ERROR, is deliberate. Every one of these is a bug in
 * authored client contract data -- not an upstream API condition a consumer
 * could act on, and not something a public page can do anything useful with.
 * The domain tests are what keep it from reaching production; throwing here
 * rather than degrading means a violation cannot be published as a quietly
 * wrong contract. */
const fail = (calculatorKey: CalculatorKey, message: string): never => {
  throw new Error(
    `Unpublishable tax calculator contract for ${calculatorKey}: ${message}`,
  )
}

const assertFieldShape = (
  calculatorKey: CalculatorKey,
  field: CalculatorField,
): void => {
  if (field.type === 'select') {
    if (!field.options || field.options.length === 0) {
      fail(calculatorKey, `select field "${field.name}" publishes no options`)
      return
    }

    const values = field.options.map((option) => option.value)

    if (values.some((value) => value.length === 0)) {
      fail(calculatorKey, `field "${field.name}" has an empty option value`)
    }

    if (new Set(values).size !== values.length) {
      fail(calculatorKey, `field "${field.name}" has duplicate option values`)
    }
  } else if (field.options) {
    fail(
      calculatorKey,
      `${field.type} field "${field.name}" must not expose options`,
    )
  }

  /* Only number input fields publish `semantic`, so a semantic anywhere else
   * would be dropped silently by the mapper and hide a client drift. */
  if (field.semantic && field.type !== 'number') {
    fail(
      calculatorKey,
      `${field.type} field "${field.name}" must not carry a semantic`,
    )
  }
}

const assertDependency = (
  calculatorKey: CalculatorKey,
  field: CalculatorField,
  fieldsByName: Map<string, CalculatorField>,
): void => {
  const { dependsOn } = field
  if (!dependsOn) {
    return
  }

  if (dependsOn.field === field.name) {
    fail(calculatorKey, `field "${field.name}" depends on itself`)
    return
  }

  const target = fieldsByName.get(dependsOn.field)
  if (!target) {
    fail(
      calculatorKey,
      `field "${field.name}" depends on unknown field "${dependsOn.field}"`,
    )
    return
  }

  if (target.type === 'date') {
    fail(
      calculatorKey,
      `field "${field.name}" depends on date field "${target.name}", which is unsupported`,
    )
    return
  }

  const equalsType = typeof dependsOn.equals
  const compatible =
    target.type === 'select'
      ? equalsType === 'string' &&
        (target.options ?? []).some(
          (option) => option.value === dependsOn.equals,
        )
      : equalsType === target.type

  if (!compatible) {
    fail(
      calculatorKey,
      `field "${field.name}" compares ${target.type} field "${target.name}" against an incompatible ${equalsType} value`,
    )
  }
}

/* Depth-first walk over the dependsOn edges. Self-reference is already caught
 * above, so this only has to find longer loops. */
const assertNoCycles = (
  calculatorKey: CalculatorKey,
  fieldsByName: Map<string, CalculatorField>,
): void => {
  const settled = new Set<string>()

  for (const name of fieldsByName.keys()) {
    if (settled.has(name)) {
      continue
    }

    const path = new Set<string>()
    let current: string | undefined = name

    while (current) {
      if (path.has(current)) {
        fail(calculatorKey, `dependency cycle through field "${current}"`)
        return
      }

      path.add(current)

      if (settled.has(current)) {
        break
      }

      current = fieldsByName.get(current)?.dependsOn?.field
    }

    path.forEach((visited) => settled.add(visited))
  }
}

const assertOutputScalarShape = (
  calculatorKey: CalculatorKey,
  field: CalculatorScalarOutputField,
  label: string,
): void => {
  if (field.semantic && field.type !== 'number') {
    fail(
      calculatorKey,
      `${label} ${field.type} field "${field.name}" must not carry a semantic`,
    )
  }
}

const assertKeySet = (
  calculatorKey: CalculatorKey,
  names: string[],
  label: string,
): void => {
  if (names.some((name) => name.length === 0)) {
    fail(calculatorKey, `${label} has a field with an empty name`)
  }

  if (new Set(names).size !== names.length) {
    fail(calculatorKey, `${label} has duplicate field names`)
  }
}

const assertOutputFieldShape = (
  calculatorKey: CalculatorKey,
  field: CalculatorOutputField,
): void => {
  if (field.kind === 'scalar') {
    assertOutputScalarShape(calculatorKey, field, 'output')
    return
  }

  if (field.itemFields.length === 0) {
    fail(
      calculatorKey,
      `array output field "${field.name}" publishes no item fields`,
    )
    return
  }

  assertKeySet(
    calculatorKey,
    field.itemFields.map((itemField) => itemField.name),
    `array output field "${field.name}"`,
  )

  field.itemFields.forEach((itemField) =>
    assertOutputScalarShape(
      calculatorKey,
      itemField,
      `array output field "${field.name}" item`,
    ),
  )
}

export const assertPublishableContract = (
  requestedKey: CalculatorKey,
  contract: CalculatorContract<CalculatorKey>,
): void => {
  if (contract.key !== requestedKey) {
    fail(
      requestedKey,
      `client returned the contract for ${contract.key} instead`,
    )
  }

  if (contract.inputFields.length === 0) {
    fail(requestedKey, 'contract publishes no input fields')
  }

  const names = contract.inputFields.map((field) => field.name)

  if (names.some((name) => name.length === 0)) {
    fail(requestedKey, 'contract has an input field with an empty name')
  }

  if (new Set(names).size !== names.length) {
    fail(requestedKey, 'contract has duplicate input field names')
  }

  const fieldsByName = new Map(
    contract.inputFields.map((field) => [field.name, field]),
  )

  contract.inputFields.forEach((field) => {
    assertFieldShape(requestedKey, field)
    assertDependency(requestedKey, field, fieldsByName)
  })

  assertNoCycles(requestedKey, fieldsByName)

  if (contract.outputFields.length === 0) {
    fail(requestedKey, 'contract publishes no output fields')
  }

  assertKeySet(
    requestedKey,
    contract.outputFields.map((field) => field.name),
    'output contract',
  )

  contract.outputFields.forEach((field) =>
    assertOutputFieldShape(requestedKey, field),
  )
}
