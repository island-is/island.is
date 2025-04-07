import {dag, Platform, Secret} from "@dagger.io/dagger";
import {_CACHE_BUST, AWS_CLI_IMAGE, AWS_REGION, AWS_SESSION_TIMEOUT_SEC, DEFAULT_PLATFORM} from "./const";
import {withCacheBust} from "./cache-bust";

export interface AWSProps {
    AWS_ACCESS_KEY_ID: Secret
    AWS_SECRET_ACCESS_KEY: Secret
}

export type EcrContainer = AWSProps & { image: string } & {platform?: Platform  | null | undefined };


export async function getEcrContainer(props: EcrContainer) {
    const ecrPassword = await getEcrPassword(props)
    const ecrHost = props.image.split('/')[0]
    const platform = props.platform ?? DEFAULT_PLATFORM;
    const image = props.image;

    return dag
      .container({platform})
      .withRegistryAuth(ecrHost, 'AWS', ecrPassword)
      .from(image)
}


const SECRET_ECR_PASSWORD = 'ECR_PASSWORD';

async function getEcrPassword(props: AWSProps){
    const container = withCacheBust(dag.container()
    .from(AWS_CLI_IMAGE)
    .withEnvVariable('AWS_REGION', AWS_REGION)
    .withSecretVariable('AWS_ACCESS_KEY_ID', props.AWS_ACCESS_KEY_ID)
    .withSecretVariable('AWS_SECRET_ACCESS_KEY', props.AWS_SECRET_ACCESS_KEY));
   
    const sessionJSON = JSON.parse(await container.withExec(['aws', 'sts', 'get-session-token', '--duration-seconds', AWS_SESSION_TIMEOUT_SEC.toString()]).stdout());
    const sessionToken = sessionJSON.Credentials.SessionToken;

    const ecrLogin = await container
    .withSecretVariable('AWS_SESSION_TOKEN', sessionToken)
    .withExec(['aws', 'ecr', 'get-login-password']).stdout();

    return dag.setSecret(SECRET_ECR_PASSWORD, ecrLogin);
}