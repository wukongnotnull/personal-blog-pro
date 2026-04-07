import bcrypt from "bcryptjs";

async function main() {
  const password = process.argv[2];

  if (!password) {
    console.error("Usage: npm run setup:admin <password>");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 12);
  console.log("\nAdd these to your .env.local file:\n");
  console.log(`ADMIN_EMAIL=admin@example.com`);
  console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  console.log("\n");
}

main();
