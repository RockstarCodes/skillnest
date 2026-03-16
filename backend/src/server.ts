import { createApp } from "./app";
import { env } from "./config/env";
import { assertDbConnection, pool } from "./config/db";
import { seedCourses } from "./seed/seedCourses";

async function main() {
  await assertDbConnection();

  // Check if database is empty
  const [rows]: any = await pool.query("SELECT COUNT(*) as count FROM subjects");

  if (rows[0].count === 0) {
    console.log("Database empty. Seeding initial courses...");
    await seedCourses();
  }

  const app = createApp();

  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});