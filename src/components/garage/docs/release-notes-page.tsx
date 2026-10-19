import { DocPageHeader } from "@/components/garage/docs/doc-page-header";
import { GARAGE_PACKAGE_VERSION as PACKAGE_VERSION } from "@/lib/garage";
import type { GarageRelease } from "@/lib/garage-changelog";

function ReleaseBody({ lines }: { lines: string[] }) {
  const blocks: { type: "h3" | "p" | "ul"; text?: string; items?: string[] }[] = [];
  let openProse = false;

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      openProse = false;
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      openProse = false;
      blocks.push({ type: "h3", text: h3[1] });
      continue;
    }

    const bullet = line.match(/^-\s+(.+)$/);
    if (bullet) {
      openProse = false;
      const last = blocks[blocks.length - 1];
      if (last?.type === "ul" && last.items) last.items.push(bullet[1]);
      else blocks.push({ type: "ul", items: [bullet[1]] });
      continue;
    }

    if (line.startsWith("All notable") || line.startsWith("heading becomes")) continue;

    if (openProse) {
      const last = blocks[blocks.length - 1];
      if (last?.type === "p" && last.text) last.text += ` ${line.trim()}`;
      else blocks.push({ type: "p", text: line.trim() });
    } else {
      blocks.push({ type: "p", text: line.trim() });
      openProse = true;
    }
  }

  return (
    <div className="space-y-3 text-[15px] leading-[1.7] text-[#A0A0A0]">
      {blocks.map((block, index) => {
        if (block.type === "h3") {
          return (
            <h3 key={index} className="pt-2 text-[16px] font-medium text-[#EDEDED]">
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-1.5 pl-5">
              {block.items?.map((item) => (
                <li key={item}>
                  <InlineMarkdown text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index}>
            <InlineMarkdown text={block.text ?? ""} />
          </p>
        );
      })}
    </div>
  );
}

function InlineMarkdown({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <code key={index} className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#EDEDED]">
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-medium text-[#EDEDED]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

export function ReleaseNotesPage({ releases }: { releases: GarageRelease[] }) {
  return (
    <article>
      <DocPageHeader
        title="Release notes"
        lede={
          <>
            What changed, and why it mattered. The package is on{" "}
            <code className="rounded bg-white/10 px-1.5 py-0.5 text-[13px] text-[#EDEDED]">
              @jatin_ux/garage@{PACKAGE_VERSION}
            </code>
            .
          </>
        }
      />

      <div className="space-y-12">
        {releases.map((release) => (
          <section key={release.id} id={release.id} className="scroll-mt-24 border-t border-white/10 pt-8">
            <h3 className="text-[22px] font-medium tracking-[-0.01em] text-[#EDEDED]">
              <a href={`#${release.id}`} className="hover:underline hover:decoration-white/30 hover:underline-offset-4">
                {release.title}
              </a>
            </h3>
            <div className="mt-4">
              <ReleaseBody lines={release.body} />
            </div>
          </section>
        ))}
      </div>
    </article>
  );
}
