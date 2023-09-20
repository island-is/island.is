import { createPipe } from "./pipes-core.js";

await createPipe(({ createPipesCore }) => {
  const mainContext = createPipesCore();
  mainContext.addScript(() => {
    console.log(`Hello world`);
  });
  return [mainContext];
});
