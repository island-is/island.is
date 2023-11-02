type Internal<T> = {
  $current: T | null
  $reset: () => void
}

type Store<T> = T & Internal<T>

type Initializer<T> = () => T

type PropertyHandlerName =
  | 'get'
  | 'set'
  | 'has'
  | 'defineProperty'
  | 'deleteProperty'

export const createStore = <T extends {}>(
  initializerFn: Initializer<T>,
): Store<T> => {
  const internal: Internal<T> = {
    $current: null,
    $reset() {
      internal.$current = null
    },
  }

  const propertyHandler =
    <Handler extends PropertyHandlerName>(handler: Handler) =>
    (target: Internal<T>, property: string, ...args: unknown[]) => {
      if (String(property).startsWith('$')) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (Reflect[handler] as any).call(
          Reflect,
          target,
          property,
          ...args,
        )
      } else {
        if (!internal.$current) {
          internal.$current = initializerFn()
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (Reflect[handler] as any).call(
          Reflect,
          internal.$current,
          property,
          ...args,
        )
      }
    }

  return new Proxy(internal, {
    get: propertyHandler('get'),
    set: propertyHandler('set'),
    has: propertyHandler('has'),
    deleteProperty: propertyHandler('deleteProperty'),
    defineProperty: propertyHandler('defineProperty'),
  }) as Store<T>
}
