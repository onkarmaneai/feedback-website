import { PrismaClient, Sentiment, SubmissionType } from "@prisma/client";
import { generateDisplayIdentity } from "../app/lib/identity";

const prisma = new PrismaClient();

async function main() {
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
  console.log(`Admin password set to: ${adminPassword}`);

  const samples = [
    {
      type: SubmissionType.feedback,
      category: "Product",
      sentiment: Sentiment.positive,
      text: "Love the new dashboard layout — it feels much cleaner.",
      tags: "ui,layout"
    },
    {
      type: SubmissionType.feedback,
      category: "Pricing",
      sentiment: Sentiment.neutral,
      text: "Would be helpful to have a mid-tier plan for smaller teams.",
      tags: "pricing"
    },
    {
      type: SubmissionType.question,
      category: "Support",
      text: "Do you offer onboarding sessions for new customers?"
    }
  ];

  for (const sample of samples) {
    const identity = generateDisplayIdentity();
    await prisma.submission.create({
      data: {
        type: sample.type,
        category: sample.category,
        sentiment: sample.sentiment,
        text: sample.text,
        tags: sample.tags,
        randomDisplayName: identity.name,
        avatarColor: identity.color
      }
    });
  }

  console.log("Seeded sample submissions.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
