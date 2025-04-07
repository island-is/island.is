import {Container} from "@dagger.io/dagger";
import {_CACHE_BUST} from "./const";

export function withCacheBust(container: Container): Container {
    return container.withEnvVariable(_CACHE_BUST, Date.now().toString());
}