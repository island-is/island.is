import { merge } from 'lodash'
import { CodeOwners } from '../../../libs/shared/constants/src/lib/codeOwners'
import type {
  Context,
  EnvironmentVariables,
  ExtraValues,
  Features,
  HealthProbe,
  InitContainers,
  MountedFile,
  PersistentVolumeClaim,
  PostgresInfo,
  RedisInfo,
  ReplicaCount,
  Resources,
  Secrets,
  ServiceDefinition,
  XroadConfig,
  PodDisruptionBudget,
  IngressMapping,
  BffInfo,
} from './types/input-types'
import { bffConfig } from './bff'
import { logger } from '../logging'
import { COMMON_SECRETS } from './consts'

/**
 * Allows you to make some properties of a type optional.
 *
 * @template OriginalType - The original type with all properties.
 * @template OptionalKeys - The keys (or names) of the properties that should be made optional.
 *
 * @returns A new type with the same properties as `OriginalType`, but with the properties specified by `OptionalKeys` made optional.
 *
 * @example
 * ```
 * type A = {
 *  foo: string
 *  bar: number
 *  baz: any
 * }
 *
 * // The following two are equivalent
 * type B = Optional<A, 'bar'>
 * type B = {
 *  foo: string
 *  bar?: number
 *  baz: any
 * }
 * ```
 */
type Optional<OriginalType, OptionalKeys extends keyof OriginalType> = Omit<
  OriginalType,
  OptionalKeys
> &
  Partial<Pick<OriginalType, OptionalKeys>>

export class ServiceBuilder<ServiceType extends string> {
  serviceDef: ServiceDefinition

  constructor(name: ServiceType) {
    this.serviceDef = {
      liveness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      readiness: { path: '/', timeoutSeconds: 3, initialDelaySeconds: 3 },
      env: {},
      features: {},
      name: name,
      grantNamespaces: [],
      grantNamespacesEnabled: false,
      secrets: COMMON_SECRETS,
      ingress: {},
      namespace: 'islandis',
      serviceAccountEnabled: false,
      securityContext: {
        privileged: false,
        allowPrivilegeEscalation: false,
      },
      resources: {
        limits: {
          memory: '256Mi',
          cpu: '200m',
        },
        requests: {
          memory: '128Mi',
          cpu: '100m',
        },
      },
      xroadConfig: [],
      files: [],
      volumes: [],
      // podDisruptionBudget: {},
    }
  }

  extraAttributes(attr: ExtraValues) {
    this.serviceDef.extraAttributes = attr
    return this
  }

  liveness(path: string | Partial<HealthProbe>) {
    if (typeof path === 'string') {
      this.serviceDef.liveness.path = path
    } else {
      this.serviceDef.liveness = { ...this.serviceDef.liveness, ...path }
    }
    return this
  }

  readiness(path: string | Partial<HealthProbe>) {
    if (typeof path === 'string') {
      this.serviceDef.readiness.path = path
    } else {
      this.serviceDef.readiness = { ...this.serviceDef.readiness, ...path }
    }
    return this
  }

  healthPort(port: number) {
    this.serviceDef.healthPort = port
    return this
  }

  targetPort(port: number) {
    this.serviceDef.port = port
    return this
  }

  features(features: Partial<Features>) {
    this.serviceDef.features = features
    return this
  }

  /**
   * Sets the namespace for your service. Default value is `islandis` (optional). It sets the [namespace](https://kubernetes.io/docs/concepts/overview/working-with-objects/namespaces/) for all resources.
   * @param name - Namespace name
   */
  namespace(name: string) {
    this.serviceDef.namespace = name
    return this
  }

  /**
   * This is necessary to allow access to this service from other namespaces. This can be the case if a pod from a different namespace is using this service. A good example of that is the ingress controller service pods that are routing traffic to the services in the cluster.
   * @param namespaces - List of namespaces that have access to the namespace this service is part of
   */
  grantNamespaces(...namespaces: string[]) {
    this.serviceDef.grantNamespaces = namespaces
    this.serviceDef.grantNamespacesEnabled = true
    return this
  }

  image(name: string) {
    this.serviceDef.image = name
    return this
  }

  setNamespace(name: string) {
    this.serviceDef.namespace = name
  }

  name() {
    return this.serviceDef.name
  }

  /**
   * Environment variables are used for a configuration that is not a secret. It can be environment-specific or not. Mapped to [environment variables](https://kubernetes.io/docs/tasks/inject-data-application/define-environment-variable-container/). Environment variables are only applied to the service. If you need those on an `initContainer` you need to specify them at that scope. That means you may need to extract and reuse or duplicate the variables if you need them both for `initContainer` and the service.
   *
   * @param envs - A mapping from environment variable name to its value. A single string sets the same value across all environment. A dictionary with keys the environments sets an individual value for each one
   *
   * @example
   * ```
   * .env({
   *    MY_VAR: 'foo',
   *    YOUR_VAR: {
   *      dev: 'foo',
   *      staging: 'bar',
   *      prod: 'baz',
   *    },
   *  })
   * ```
   *
   */
  env(envs: EnvironmentVariables) {
    this.assertUnset(this.serviceDef.env, envs)
    this.serviceDef.env = { ...this.serviceDef.env, ...envs }
    return this
  }

  bff(config: BffInfo) {
    this.serviceDef.env = { ...bffConfig(config).env, ...this.serviceDef.env }
    this.serviceDef.secrets = {
      ...bffConfig(config).secrets,
      ...this.serviceDef.secrets,
    }
    return this
  }

  codeOwner(codeOwner: CodeOwners) {
    this.serviceDef.env['CODE_OWNER'] = codeOwner
    return this
  }

  /**
   * X-Road configuration blocks to inject to the container. Types of XroadConfig can contain environment variables and/or secrets that define how to contact an external service through X-Road.
   * @param ...configs - X-road configs
   */
  xroad(...configs: XroadConfig[]) {
    this.serviceDef.xroadConfig = [...this.serviceDef.xroadConfig, ...configs]
    return this
  }

  /**
   * Files to be mounted inside the containers. Files must be in the helm repo.
   * @param ...files - List of MountedFile
   */
  files(...files: MountedFile[]) {
    this.serviceDef.files = [...this.serviceDef.files, ...files]
    return this
  }

  /**
   * Volumes to create and attach to containers.
   * @param ...volumes - Volume configs
   */
  volumes(...volumes: PersistentVolumeClaim[]) {
    this.serviceDef.volumes = [...this.serviceDef.volumes, ...volumes]
    return this
  }

  /**
   * PodDisruptionBudget is a Kubernetes resource that ensures that a minimum number of pods are available at any given time. It is used to prevent Kubernetes from killing all pods of a service at once. Mapped to a [PodDisruptionBudget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/).
   * @param pdb - PodDisruptionBudget definitions
   */
  podDisruption(pdb: PodDisruptionBudget) {
    this.serviceDef.podDisruptionBudget = pdb
    return this
  }

  /**
   * Secrets are configuration that is resolved at deployment time. Their values are _paths_ in the Parameter Store in AWS Systems Manager. There is a service in Kubernetes that resolves the concrete value of these secrets and they appear as environment variables on the service or the `initContainer`. Mapped to [ExternalSecrets](https://github.com/godaddy/kubernetes-external-secrets). Like environment variables, secrets are only applied to the service. If you need those on an `initContainer` you need to specify them at that scope.
   *
   * To provision secrets in the Parameter Store, you need to get in touch with the DevOps team.
   *
   * @param secrets - Maps of secret names and their corresponding paths
   */
  secrets(secrets: Secrets) {
    this.assertUnset(this.serviceDef.secrets, secrets)
    this.serviceDef.secrets = { ...this.serviceDef.secrets, ...secrets }
    return this
  }

  command(cmd: string) {
    this.serviceDef.cmds = cmd
    return this
  }

  args(...args: string[]) {
    this.serviceDef.args = args
    return this
  }

  redis(redis?: RedisInfo) {
    this.serviceDef.redis = redis ?? {}
    return this
  }

  resources(res: Resources) {
    this.serviceDef.resources = res
    return this
  }

  replicaCount(replicaCount: ReplicaCount) {
    this.serviceDef.replicaCount = replicaCount
    return this
  }

  private stripPostfix(name: string): string
  private stripPostfix(
    name: string,
    opts?: { postfixes?: string[]; extraPostfixes?: string[] },
  ): string
  private stripPostfix(name: undefined): undefined
  private stripPostfix(name?: string): string | undefined
  private stripPostfix(
    name?: string,
    opts?: { postfixes?: string[]; extraPostfixes?: string[] },
  ): string | undefined
  private stripPostfix(
    name?: string,
    { postfixes = ['-worker', '-job'], extraPostfixes = [] } = {},
  ) {
    if (!name) return
    logger.debug(`Stripping postfixes from ${name} with:`, {
      postfixes,
      extraPostfixes,
    })
    postfixes.push(...extraPostfixes)
    // Strip postfixes from database name
    for (const postfix of postfixes) {
      if (name.endsWith(postfix)) {
        name = name.replace(postfix, '')
        // Recurse to strip multiple postfixes
        return this.stripPostfix(name, { postfixes, extraPostfixes })
      }
    }
    return name
  }

  /**
   * Merges the properties of the provided PostgresInfo objects, optionally creating a copy instead of modifying in-place.
   * If `copy` is true, a copy of the target object is created and merged with the `postgres` object, if false, the target object is modified in-place.
   * Additionally, defaults are applied to the output via `postgresDefoluts`.
   * The `extensions` property of the resulting object is a concatenation of the `extensions` properties of the `target` and `postgres` objects.
   * If the `extensions` property of the resulting object is an empty array, it is set to undefined.
   *
   * @param {PostgresInfo} [target] - The target object to be merged. If not provided, an empty object is used.
   * @param {PostgresInfo} [postgres] - The object to merge with the target object. If not provided, an empty object is used.
   * @param {Object} [opts]  - Optional flag indicating whether to create a copy of the target object before merging.
   * @param {boolean} [opts.copy=false] - Optional flag indicating whether to create a copy of the target object before merging.
   * @returns {PostgresInfo} target - The resulting object after merging.
   */
  private grantDB(
    target?: PostgresInfo,
    postgres?: PostgresInfo,
    opts?: { copy: boolean },
  ): PostgresInfo
  private grantDB(target?: PostgresInfo, postgres?: PostgresInfo): PostgresInfo
  private grantDB(
    target?: PostgresInfo,
    postgres?: PostgresInfo,
    { copy = false } = {},
  ): PostgresInfo {
    if (copy) {
      const targetCopy = merge({}, target)
      return this.grantDB(targetCopy, postgres, { copy: false })
    }
    if (!target) {
      target = {}
    }
    const dbExtensions = new Set([
      ...(target.extensions ?? []),
      ...(postgres?.extensions ?? []),
    ])

    merge(target, postgres)
    merge(target, this.postgresDefaults(postgres ?? {}))
    if (dbExtensions.size > 0) target.extensions = [...dbExtensions.keys()]
    if (target.extensions?.length === 0) delete target.extensions

    return target
  }

  /**
   * Initializes a container with optional parameters and checks for unique container names.
   * If the 'withDB' flag is set or if the 'postgres' property is present in the input object,
   * it grants database access toethe container.
   * Maps to a Pod specification for an [initContainer](https://kubernetes.io/docs/concepts/workloads/pods/init-containers/).
   *
   * @param ic - The initial container configuration.
   * @param [withDB=false] - Optional flag indicating whether to grant database access to the container.
   * @throws Throws an error if multiple init containers do not have unique names.
   * @returns Returns the current instance for chaining.
   */
  initContainer(
    ic: Optional<InitContainers, 'envs' | 'secrets' | 'features'>,
    withDB: boolean = false,
  ): this {
    // Combine current and new containers
    ic.containers = (this.serviceDef.initContainers?.containers ?? []).concat(
      ic.containers,
    )
    if (withDB || ic.postgres) {
      ic.postgres = this.grantDB(
        this.serviceDef.initContainers?.postgres,
        ic.postgres,
      )
      withDB = true
    }

    const uniqueNames = new Set((ic.containers ?? []).map((c) => c.name))
    if (uniqueNames.size != ic.containers.length) {
      throw new Error(
        'For multiple init containers, you must set a unique name for each container.',
      )
    }

    this.serviceDef.initContainers = {
      envs: {},
      secrets: {},
      features: {},
      ...ic,
    }
    logger.debug(`Created initcontainer for ${this.serviceDef.name}:`, {
      ic: this.serviceDef.initContainers,
    })
    return this
  }

  db(): this
  db(postgres: PostgresInfo): this
  db(postgres?: PostgresInfo): this
  db(postgres?: PostgresInfo): this {
    if (
      (this.serviceDef.initContainers?.containers ?? []).length > 0 &&
      this.serviceDef.postgres
    ) {
      // Require initContainers which need DB to be used _after_ DB config
      throw new Error(
        "DB config must be set before initContainers, i.e. `service('my-service').db().initContainer()`",
      )
    }
    if (postgres) {
      logger.debug(`Configuring custom DB for ${this.serviceDef.name} with:`, {
        postgres,
      })
    }
    this.serviceDef.postgres = this.grantDB(this.serviceDef.postgres, postgres)
    logger.debug(`Setting DB config for ${this.serviceDef.name} to:`, {
      postgres: this.serviceDef.postgres,
    })
    return this
  }

  /**
   * @deprecated Please use `.db()` instead
   */
  postgres(): this
  postgres(args: Parameters<typeof this.db>): this
  postgres(args?: Parameters<typeof this.db>): this {
    if (!args) {
      return this.db()
    }
    return this.db(...args)
  }

  migrations(postgres?: PostgresInfo): this {
    if (postgres) {
      logger.debug(
        `Configuring custom migrations for ${this.serviceDef.name} with:`,
        { postgres },
      )
    }
    postgres = this.grantDB(this.serviceDef.initContainers?.postgres, postgres)
    return this.initContainer({
      containers: [
        {
          name: 'migrations',
          command: 'npx',
          args: ['sequelize-cli', 'db:migrate'],
        },
      ],
      postgres,
    })
  }
  seed(postgres?: PostgresInfo): this {
    if (postgres) {
      logger.debug(
        `Configuring custom seed for ${this.serviceDef.name} with:`,
        {
          postgres,
        },
      )
    }
    postgres = this.grantDB(this.serviceDef.initContainers?.postgres, postgres)
    return this.initContainer({
      containers: [
        {
          name: 'seed',
          command: 'npx',
          args: ['sequelize-cli', 'db:seed:all'],
        },
      ],
      postgres,
    })
  }

  /**
   * You can allow ingress traffic (traffic from the internet) to your service by creating an ingress controller. Mapped to an [Ingress](https://kubernetes.io/docs/concepts/services-networking/ingress/#what-is-ingress).
   * @param ingress - Ingress parameters
   */
  ingress(ingress: IngressMapping) {
    this.serviceDef.ingress = ingress
    return this
  }

  /**
   * If your service needs to perform AWS API calls, you will need to create a [service account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/) and associate it with an AWS IAM role using Kubernetes annotations.
   *
   * The AWS IAM Role and its permissions needs to be provisioned by the DevOps team.
   *
   * @param name - Service account name
   */
  serviceAccount(name?: string) {
    this.serviceDef.accountName = name ?? this.serviceDef.name
    this.serviceDef.serviceAccountEnabled = true
    return this
  }

  /**
   * Validates that no environment variables are set twice. Throws if any are duplicated.
   */
  private assertUnset<T extends {}>(current: T, envs: T) {
    const intersection = Object.keys({
      ...current,
    }).filter({}.hasOwnProperty.bind(envs))
    if (intersection.length) {
      throw new Error(
        `Trying to set same environment variable multiple times: ${intersection}`,
      )
    }
  }

  private postgresDefaults = (pg: PostgresInfo): PostgresInfo => {
    const postgres = merge({}, this.serviceDef.postgres) // Copy current config
    merge(postgres, pg) // Copy custom config for templating defaults

    const defaultName = postgres.name ?? this.serviceDef.name
    // Set a sane `name` if missing

    // Apply sane defaults, templated by `name` etc.
    merge(postgres, {
      username:
        postgres.username ??
        postgresIdentifier(
          this.stripPostfix(defaultName) + (postgres.readOnly ? '/read' : ''),
        ),
      passwordSecret:
        postgres.passwordSecret ??
        `/k8s/${this.stripPostfix(defaultName)}${
          postgres.readOnly ? '/readonly' : ''
        }/DB_PASSWORD`,
      //These are already covered by the merge above
      // host: postgres.host ?? this.serviceDef.postgres?.host, // Allows missing host
      // readOnly: postgres.readOnly,
      // extensions: postgres.extensions,
      // name: defaultName,
    })

    merge(postgres, pg) // Set overrides
    merge(postgres, {
      // `name` is the DB name, which is a postgres identifier
      name: postgresIdentifier(this.stripPostfix(defaultName)),
    })

    logger.debug(
      `Set default DB config for ${this.serviceDef.name} to: `,
      postgres,
    )

    if (Object.keys(pg).length > 0) {
      logger.debug(`Configured custom DB for ${this.serviceDef.name} with: `, {
        input: pg,
        output: postgres,
      })
    }

    return postgres
  }
}

const postgresIdentifier = (id?: string) => id?.replace(/[\W\s]/gi, '_')

export const ref = (renderer: (env: Context) => string) => {
  return renderer
}

export const service = <Service extends string>(
  name: Service,
): ServiceBuilder<Service> => {
  return new ServiceBuilder<Service>(name)
}

export const json = (value: unknown): string => JSON.stringify(value)

export { CodeOwners }
export type { Context }
