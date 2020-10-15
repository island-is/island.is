/**
 * Factory which runs a function to create one or more objects.
 */
import { times } from './times'

type InitializerFn<T, FactoryArgs extends Array<any>> = (
  ...args: FactoryArgs
) => T

type Factory<T, FactoryArgs extends Array<any>> = {
  (...args: FactoryArgs): T
  list(count: number, ...args: FactoryArgs): T[]
}

/**
 * Factory to create one or more objects with a function factory.
 *
 * Supports inferred typing and dynamic arguments.
 *
 * Usage:
 *
 * ```typescript
 * const section = simpleFactory((type?: SectionType) => {
 *   type = type || Faker.random.arrayElement(sectionTypes)
 *
 *   switch (type) {
 *     case 'content':
 *       return contentSection()
 *     case 'image':
 *       return imageSection()
 *   }
 * })
 *
 * section()
 * > contentSection | imageSection
 *
 * section('content')
 * > contentSection
 *
 * section.list(3)
 * > [contentSection, imageSection, imageSection]
 *
 * section.list(3, 'image')
 * > [imageSection, imageSection, imageSection]
 * ```
 */
export const simpleFactory = <T, FactoryArgs extends Array<any>>(
  initializer: InitializerFn<T, FactoryArgs>,
) => {
  const factoryFn = (...args: FactoryArgs) => initializer(...args)
  factoryFn.list = times(factoryFn)

  return factoryFn
}
