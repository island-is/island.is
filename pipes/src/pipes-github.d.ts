import { createModuleDef, PipesCoreModule, Simplify } from './pipes-core.js';
import { Octokit } from '@octokit/rest';

type GithubUser = {
    login: string;
};
type GithubRepository = {
    fullName: string;
    name: string;
    owner: GithubUser;
};
type GithubPRUrls = {
    htmlUrl: string;
    commentsUrl: string;
};
type GithubPR = {
    name: string;
    number: number;
    action: string;
    sourceBranch: string;
    targetBranch: string;
    initiator: GithubUser;
    repository: GithubRepository;
    urls: GithubPRUrls;
} | null;
interface IGitHubConfig {
    githubToken: string;
    githubOwner: string;
    githubRepo: string;
    githubCurrentPr: GithubPR;
}
interface IGitHubContext {
    githubGetTagsFromPR: (prop: {
        prNumber: number;
    }) => Promise<string[]>;
    githubDeleteMergedBranch: (prop: {
        branchName: string;
    }) => Promise<void>;
    githubDeleteCurrentMergedBranch: () => Promise<void>;
    githubInitPr: () => void;
    githubOctokit: Octokit | null;
    githubMergePR: (prop: {
        prNumber: number;
    }) => Promise<void>;
    githubMergeCurrentPR: () => Promise<void>;
    githubGetOctokit: () => Octokit;
    githubWriteCommentToPR: (prop: {
        prNumber: number;
        comment: string;
    }) => Promise<void>;
    githubAddTagToPR: (prop: {
        prNumber: number;
        tagName: string;
    }) => Promise<void>;
    githubRemoveTagToPR: (prop: {
        prNumber: number;
        tagName: string;
    }) => Promise<void>;
    githubAddTagToCurrentPr: (prop: {
        tagName: string;
    }) => Promise<void>;
    githubRemoveTagFromCurrentPr: (prop: {
        tagName: string;
    }) => Promise<void>;
    githubWriteCommentToCurrentPr: (prop: {
        comment: string;
    }) => Promise<void>;
    githubAllChecksPassed: (prop: {
        prNumber: number;
    }) => Promise<boolean>;
    githubAllChecksPassedCurrentPR: () => Promise<boolean>;
}
type PipesGitHubModule = createModuleDef<"PipesGitHub", IGitHubContext, IGitHubConfig, [PipesCoreModule]>;
declare const PipesGitHub: {
    name: "PipesGitHub";
    config: Simplify<PipesGitHubModule["Config"]["Implement"]>;
    context: Simplify<PipesGitHubModule["Context"]["Implement"]>;
    required: "PipesCore"[];
    optional: [];
};

export { PipesGitHub, type PipesGitHubModule };
