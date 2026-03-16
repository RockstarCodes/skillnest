import { createApp } from "./app";
import { env } from "./config/env";
import { assertDbConnection } from "./config/db";

async function main() {
  await assertDbConnection();

  const app = createApp();
  app.listen(env.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

