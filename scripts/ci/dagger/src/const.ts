import {Platform} from "@dagger.io/dagger";

export const GITHUB_URL = "https://github.com/island-is/island.is/";
export const RUNNER_IMAGE = '821090935708.dkr.ecr.eu-west-1.amazonaws.com/actions-runner:arc-efs_e8a77b7ccb_535';
export const AWS_REGION = 'eu-west-1';
export const _CACHE_BUST = '_CACHE_BUST';
export const DEFAULT_PLATFORM = 'linux/amd64' as Platform;
export const AWS_CLI_IMAGE = 'amazon/aws-cli:2.24.22';
export const AWS_SESSION_TIMEOUT_SEC = 60 * 60 * 2;
export const WORKDIR = '/home/runner/_work/island.is/island.is';

export const OWNER_USERNAME = 'runner';
export const OWNER_GROUP = 'runner';
export const OWNER = `${OWNER_USERNAME}:${OWNER_GROUP}`;
export const FILE_SETTINGS = {
    owner: OWNER,
}