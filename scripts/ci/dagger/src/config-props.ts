import {Directory, Secret} from "@dagger.io/dagger";
import {FILE_ACTION, FILE_ACTION_GITHUB_BRANCH, FILE_ACTION_GITHUB_SHA, FILE_ACTION_LOCAL} from "./interface";

interface Props {
    AWS_ACCESS_KEY_ID: Secret, 
    AWS_SECRET_ACCESS_KEY: Secret, action: FILE_ACTION, branch?: string | null | undefined, sha?: string | null | undefined, files?: Directory | null | undefined
}
export function getProps (props: Props) {
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, action, branch, sha, files } = props;
    {
      Object.entries(props).forEach(([key, value]) => {
        if (value instanceof Secret || value instanceof Directory) {
          return;
        }
        if (value == null || value === undefined) {
          return;
        }
        console.log(`Property: ${key}: ${value}`);
      });
    }
    if (action === FILE_ACTION_GITHUB_SHA) {
        if (!sha) {
          throw new Error('sha is required when action is sha');
        }
        return { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, action, sha } 
      }
      if (action === FILE_ACTION_GITHUB_BRANCH) {
        if (!branch) {
          throw new Error('branch is required when action is branch');
        }
        return { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, action, branch }
      }
      if (action === FILE_ACTION_LOCAL) {
        if (!files) {
          throw new Error('files is required when action is local');
        }
        return { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, action, files }
      }
      throw new Error('action must be one of sha, branch or local');
}