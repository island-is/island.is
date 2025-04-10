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
import {getTargetBranch} from "./const";

type JobState = 'success' | 'failure' | 'abandoned' | 'cancelled' | 'skipped'

const failedStates: JobState[] = ['failure', 'abandoned', 'cancelled']

@object()
export class Dagger {
  @func()
  async prepareBase(
    action: string,
    AWS_ECR_PASSWORD: Secret,
    targetBranch: string = 'main',
    headSha?: string,
    baseSha?: string,
    branch?: string,
    sha?: string,
    files?: Directory,
    NX_CLOUD_ACCESS_TOKEN?: Secret,
  ): Promise<string> {
    
    const props = getProps({
      action: action as FILE_ACTION,
      branch,
      sha,
      files,
    })
    const {headSha: newHeadSha, baseSha: newBaseSha} = (await getMonorepoBase({
      AWS_ECR_PASSWORD,
      NX_CLOUD_ACCESS_TOKEN,
      headSha,
      baseSha,
      targetBranch,
      sha,
      branch,
      ...props,
    }));
    return JSON.stringify({
      NX_HEAD: newHeadSha,
      NX_BASE: newBaseSha,
    });
  }
}
