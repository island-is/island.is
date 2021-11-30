import { times } from './times'

type InitializerProp<T, P extends keyof T> = T[P] | ((this: T, obj: T) => T[P])

type InitializerProps<T> = {
  [P in keyof T]: InitializerProp<T, P>
}

type OverrideProps<T> = {
  [P in keyof T]?: InitializerProp<T, P>
}

type TraitMap<T> = {
  [P: string]: OverrideProps<T>
}

type Initializer<T> = InitializerProps<T> & {
  $traits?: TraitMap<T>
}

type FactoryArgs<T> = Array<string | OverrideProps<T>>

type Factory<T> = {
  (...data: FactoryArgs<T>): T
  list(count: number, ...data: FactoryArgs<T>): Array<T>
}

const findTrait = <T>(
  name: keyof TraitMap<T>,
  traits: TraitMap<T>,
): InitializerProps<T> => {
  if (name in traits) {
    return (traits as never)[name]
  }
  throw new Error(`Trait ${name} does not exist.`)
}

/**
 * Factory to create one or more objects based on an object template.
 *
 * Supports explicit typing, lazy fields, traits and overrides.
 *
 * Usage:
 *
 * ```typescript
 * const person = factory<Person>({
 *   // Static values
 *   type: 'Person',
 *
 *   // Lazy values
 *   name: () => faker.name.findName(),
 *
 *   // Dependent values
 *   slug: ({ title }) => faker.helpers.slugify(title),
 *
 *   // Traits
 *   $traits: {
 *     kid: {
 *       age: () => faker.datatype.number({min: 6, max: 16}),
 *     },
 *     noSlug: {
 *       slug: null,
 *     }
 *   }
 * })
 *
 * person()
 * > { type: 'Person', name: 'John Doe', slug: 'john-doe', age: 20 }
 *
 * // Overriding fields.
 * person({ name: 'Jon Jonsson' })
 * > { type: 'Person', name: 'Jon Jonsson', slug: 'jon-jonsson', age: 20 }
 *
 * // Using traits.
 * person('kid', 'noSlug', { name: 'Jake' })
 * > { type: 'Person', name: 'Jake', slug: null, age: 7 }
 *
 * // Creating a list of objects.
 * person.list(3, 'kid', 'noSlug')
 * > [
 * >   { type: 'Person', name: 'Mickey', slug: null, age: 9 },
 * >   { type: 'Person', name: 'Pete', slug: null, age: 15 },
 * >   { type: 'Person', name: 'Donald', slug: null, age: 13 },
 * > ]
 * ```
 */
export const factory = <T extends object>(init: Initializer<T>): Factory<T> => {
  const traitMap = init.$traits || {}
  const factoryFn = (...data: FactoryArgs<T>) => {
    const record: Record<string, unknown> = {}
    const initializers = [init as OverrideProps<T>].concat(
      data.map((arg) =>
        typeof arg === 'string' ? findTrait<T>(arg, traitMap) : arg,
      ),
    )

    for (const key of Object.keys(init)) {
      if (key === '$traits') {
        continue
      }

      // Find the last initializer that defines this attribute.
      for (let i = initializers.length - 1; i >= 0; i--) {
        let value = (initializers[i] as never)[key] as unknown
        if (value !== undefined) {
          if (typeof value === 'function') {
            value = value.call(record, record)
          }
          record[key] = value
          break
        }
      }
    }
    return record as T
  }

  factoryFn.list = times(factoryFn)

  return factoryFn
}
