import Link from "next/link";
import { prisma } from "../../lib/prisma";
import { formatDate, labelType } from "../../lib/utils";

export default async function ItemPage({ params }: { params: { id: string } }) {
  const item = await prisma.submission.findUnique({
    where: { id: params.id },
    include: { answer: true }
  });

  if (!item || item.status === "hidden") {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <div className="card p-6">
          <h1 className="text-xl font-semibold">Submission not available</h1>
          <p className="mt-2 text-sm text-gray-600">This item may have been removed.</p>
          <Link href="/" className="mt-4 inline-flex text-sm font-semibold text-black">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: item.avatarColor }}
          >
            {item.randomDisplayName
              .split(" ")
              .map((part) => part[0])
              .join("")}
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">{item.randomDisplayName}</h1>
            <p className="text-sm text-gray-500">
              {labelType(item.type)} · {item.category} · {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-gray-700">{item.text}</p>
        {item.answer?.isPublished && (
          <div className="mt-6 rounded-xl border border-black/10 bg-slate-50 px-4 py-3">
            <p className="text-xs font-semibold uppercase text-gray-400">Answer</p>
            <p className="mt-1 text-sm text-gray-800">{item.answer.text}</p>
          </div>
        )}
        <Link href="/" className="mt-6 inline-flex text-sm font-semibold text-black">
          Back to board
        </Link>
      </div>
    </div>
  );
}
