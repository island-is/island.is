import fsSync from 'node:fs';
import { z, createConfig, createContext, createModule } from './pipes-core.js';
import { Octokit } from '@octokit/rest';

const githubUserschema = z.object({
    login: z.string()
}).default({
    login: ""
});
const githubRepository = z.object({
    fullName: z.string(),
    name: z.string(),
    owner: githubUserschema
}).default({
    fullName: "",
    name: "",
    owner: {
        login: ""
    }
});
const githubPRUrls = z.object({
    htmlUrl: z.string(),
    commentsUrl: z.string()
}).default({
    htmlUrl: "",
    commentsUrl: ""
});
const getDefaultIfCI = ()=>{
    // Check if running in a GitHub Actions environment
    if (process.env.CI !== "true" || !process.env.GITHUB_EVENT_PATH) {
        return undefined;
    }
    // Read the GitHub Actions event payload
    const eventPath = process.env.GITHUB_EVENT_PATH;
    const eventData = JSON.parse(fsSync.readFileSync(eventPath, "utf8"));
    if (!eventData.pull_request) {
        return undefined;
    }
    const prData = eventData.pull_request;
    const repositoryData = eventData.repository;
    const actionData = eventData.action;
    const value = {
        name: repositoryData.full_name,
        number: prData.number,
        action: actionData,
        sourceBranch: prData.head.ref,
        targetBranch: prData.base.ref,
        initiator: {
            login: prData.user.login
        },
        repository: {
            fullName: repositoryData.full_name,
            name: repositoryData.name,
            owner: {
                login: repositoryData.owner.login
            }
        },
        urls: {
            htmlUrl: prData.html_url,
            commentsUrl: prData.comments_url
        }
    };
    // Test parsing
    const parsed = z.object({
        name: z.string(),
        number: z.number(),
        action: z.string(),
        sourceBranch: z.string(),
        targetBranch: z.string(),
        initiator: githubUserschema,
        repository: githubRepository,
        urls: githubPRUrls
    }).strict().safeParse(value);
    return parsed.success ? parsed.data : undefined;
};
const GitHubConfig = createConfig(({ z })=>({
        githubToken: z.string().default(process.env.GITHUB_TOKEN ?? ""),
        githubOwner: z.string().default(process.env.GITHUB_REPOSITORY?.split("/")[0] ?? ""),
        githubRepo: z.string().default(process.env.GITHUB_REPOSITORY?.split("/")[1] ?? ""),
        githubCurrentPr: z.optional(z.object({
            name: z.string(),
            number: z.number(),
            action: z.string(),
            sourceBranch: z.string(),
            targetBranch: z.string(),
            initiator: githubUserschema,
            repository: githubRepository,
            urls: githubPRUrls
        }))
    }));
const GitHubContext = createContext(({ z, fn })=>({
        githubDeleteMergedBranch: fn({
            value: z.object({
                branchName: z.string()
            }),
            output: z.custom(),
            implement: async (context, config, { branchName })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                const octokit = context.githubGetOctokit();
                await octokit.rest.git.deleteRef({
                    owner,
                    repo,
                    ref: `heads/${branchName}`
                });
            }
        }),
        // Function to delete the branch of the current PR if it is merged
        githubDeleteCurrentMergedBranch: fn({
            output: z.custom(),
            implement: async (context, config)=>{
                if (!config.githubCurrentPr?.sourceBranch) {
                    throw new Error("Current PR info not available");
                }
                await context.githubDeleteMergedBranch({
                    branchName: config.githubCurrentPr.sourceBranch
                });
            }
        }),
        githubAllChecksPassed: fn({
            value: z.object({
                prNumber: z.number()
            }),
            output: z.custom((val)=>val),
            implement: async (context, config, { prNumber })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                const octokit = context.githubGetOctokit();
                const { data: prData } = await octokit.rest.pulls.get({
                    owner,
                    repo,
                    pull_number: prNumber
                });
                const { data: checkRuns } = await octokit.rest.checks.listForRef({
                    owner,
                    repo,
                    ref: prData.head.sha
                });
                return checkRuns.check_runs.every((run)=>run.conclusion === "success");
            }
        }),
        githubAllChecksPassedCurrentPR: fn({
            output: z.custom(),
            implement: (context, config)=>{
                if (!config.githubCurrentPr?.number) {
                    throw new Error("Current PR info not available");
                }
                return context.githubAllChecksPassed({
                    prNumber: config.githubCurrentPr.number
                });
            }
        }),
        githubInitPr: fn({
            implement: (_context, config)=>{
                const value = getDefaultIfCI();
                if (value) {
                    config.githubToken = process.env.GITHUB_TOKEN ?? "";
                    config.githubOwner = (process.env.GITHUB_REPOSITORY ?? "").split("/")[0];
                    config.githubRepo = (process.env.GITHUB_REPOSITORY ?? "").split("/")[1];
                    config.githubCurrentPr = value;
                    return;
                }
                throw new Error("Could not set config");
            }
        }),
        githubOctokit: z.optional(z.custom()),
        githubGetOctokit: fn({
            output: z.custom(),
            implement: (context, config)=>{
                if (!config.githubToken) {
                    throw new Error("GitHub token not available");
                }
                if (!context.githubOctokit) {
                    context.githubOctokit = new Octokit({
                        auth: config.githubToken
                    });
                }
                return context.githubOctokit;
            }
        }),
        githubWriteCommentToPR: fn({
            value: z.object({
                prNumber: z.number(),
                comment: z.string()
            }),
            output: z.custom((val)=>val),
            implement: async (context, config, { prNumber, comment })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                await context.githubGetOctokit().rest.issues.createComment({
                    owner,
                    repo,
                    issue_number: prNumber,
                    body: comment
                });
            }
        }),
        githubGetTagsFromPR: fn({
            value: z.object({
                prNumber: z.number()
            }),
            output: z.custom((value)=>value),
            implement: async (context, config, { prNumber })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                const value = await context.githubGetOctokit().rest.issues.listLabelsOnIssue({
                    owner,
                    repo,
                    issue_number: prNumber
                });
                const tags = value.data.map(({ node_id })=>node_id);
                return tags;
            }
        }),
        githubRemoveTagToPR: fn({
            value: z.object({
                prNumber: z.number(),
                tagName: z.string()
            }),
            output: z.custom((val)=>val),
            implement: async (context, config, { prNumber, tagName })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                await context.githubGetOctokit().rest.issues.removeLabel({
                    owner,
                    repo,
                    issue_number: prNumber,
                    name: tagName
                });
            }
        }),
        githubAddTagToPR: fn({
            value: z.object({
                prNumber: z.number(),
                tagName: z.string()
            }),
            output: z.custom((val)=>val),
            implement: async (context, config, { prNumber, tagName })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                await context.githubGetOctokit().rest.issues.addLabels({
                    owner,
                    repo,
                    issue_number: prNumber,
                    labels: [
                        tagName
                    ]
                });
            }
        }),
        githubAddTagToCurrentPr: fn({
            value: z.object({
                tagName: z.string()
            }),
            output: z.custom(),
            implement: async (context, config, { tagName })=>{
                if (!config.githubCurrentPr?.number) {
                    throw new Error("Current PR info not available");
                }
                await context.githubAddTagToPR({
                    prNumber: config.githubCurrentPr.number,
                    tagName
                });
            }
        }),
        githubRemoveTagFromCurrentPr: fn({
            value: z.object({
                tagName: z.string()
            }),
            output: z.custom(),
            implement: async (context, config, { tagName })=>{
                if (!config.githubCurrentPr?.number) {
                    throw new Error("Current PR info not available");
                }
                await context.githubRemoveTagToPR({
                    prNumber: config.githubCurrentPr.number,
                    tagName
                });
            }
        }),
        githubWriteCommentToCurrentPr: fn({
            value: z.object({
                comment: z.string()
            }),
            output: z.custom(),
            implement: async (context, config, { comment })=>{
                if (!config.githubCurrentPr?.number) {
                    throw new Error("Current PR info not available");
                }
                await context.githubWriteCommentToPR({
                    prNumber: config.githubCurrentPr.number,
                    comment
                });
            }
        }),
        githubMergePR: fn({
            value: z.object({
                prNumber: z.number()
            }),
            output: z.custom(),
            implement: async (context, config, { prNumber })=>{
                const owner = config.githubOwner;
                const repo = config.githubRepo;
                await context.githubGetOctokit().rest.pulls.merge({
                    owner,
                    repo,
                    pull_number: prNumber,
                    merge_method: "squash"
                });
            }
        }),
        githubMergeCurrentPR: fn({
            output: z.custom(),
            implement: async (context, config)=>{
                if (!config.githubCurrentPr?.number) {
                    throw new Error("Current PR info not available");
                }
                await context.githubMergePR({
                    prNumber: config.githubCurrentPr.number
                });
            }
        })
    }));
const PipesGitHub = createModule({
    name: "PipesGitHub",
    config: GitHubConfig,
    context: GitHubContext,
    required: [
        "PipesCore"
    ],
    optional: []
});

export { PipesGitHub };
//# sourceMappingURL=pipes-module-github.js.map
