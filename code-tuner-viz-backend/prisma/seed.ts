import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
  // clear existing
  await prisma.metricRecord.deleteMany();

  const projects = ["Your Project", "Benchmark A", "Benchmark B"];
  const classes = [
    "UserService",
    "OrderController",
    "InvoiceGenerator",
    "MetricsCollector",
    "AuthMiddleware",
    "PaymentService",
    "SearchIndex",
    "NotificationHub",
    "ProfileController",
    "ReportBuilder"
  ];

  const now = new Date();
  const daysBack = 160;

  const rows: any[] = [];

  for (const project of projects) {
    for (let d = daysBack; d >= 0; d -= 7) {
      const measuredAt = new Date(now);
      measuredAt.setDate(now.getDate() - d);

      for (const className of classes) {
        const loc = randInt(80, 420);
        const methods = randInt(4, 28);

        // Make benchmarks differ slightly
        const base =
          project === "Your Project" ? 0 :
          project === "Benchmark A" ? 1 :
          -1;

        const cyclomaticComplexity = Math.max(1, randInt(2, 10) + base);

        rows.push({
          project,
          className,
          loc,
          methods,
          cyclomaticComplexity,
          measuredAt
        });
      }
    }
  }

  await prisma.metricRecord.createMany({ data: rows });

  console.log(`Seeded ${rows.length} metric records.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
