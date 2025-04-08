import {
  dag,
  Container,
  Directory,
  object,
  func,
  Secret,
} from '@dagger.io/dagger'
import { getMonorepoBase } from './container'
import { getProps } from './config-props'
import {FILE_ACTION} from "./interface";

type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped'

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  @func()
  async test(
    action: string,
    branch?: string,
    sha?: string,
    files?: Directory,
  ) {
    const props = getProps({
      action: action as FILE_ACTION,
      branch,
      sha,
      files,
    })
    const container = await getMonorepoBase({
      ...props,
    })
  }
}
