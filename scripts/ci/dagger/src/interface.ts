import {Secret} from "@dagger.io/dagger";

export type FILE_ACTION = 'sha' | 'branch' | 'local';
export type FILE_ACTION_LOCAL = 'local';
export const FILE_ACTION_LOCAL = 'local';
export type FILE_ACTION_GITHUB = 'sha' | 'branch';
export type FILE_ACTION_GITHUB_BRANCH = 'branch';
export const FILE_ACTION_GITHUB_BRANCH = 'branch';
export type FILE_ACTION_GITHUB_SHA = 'sha';
export const FILE_ACTION_GITHUB_SHA = 'sha';
export interface AWSProps {
  AWS_ECR_PASSWORD: Secret;
}

export interface NXProps {
    NX_CLOUD_ACCESS_TOKEN?: Secret;
}
