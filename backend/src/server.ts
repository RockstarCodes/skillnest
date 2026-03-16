import { createApp } from "./app";
import { env } from "./config/env";
import { assertDbConnection } from "./config/db";

async function main() {
  await assertDbConnection();

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});