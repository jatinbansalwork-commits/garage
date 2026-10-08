import Link from "next/link";
import { GarageBoxPile } from "@/components/garage/garage-box-pile";
import { GarageEmailSignup } from "@/components/garage/garage-email-signup";
import { ComponentRef } from "@/components/garage/garage-ui";
import { JsonLd } from "@/components/seo/json-ld";
import { ROUTES } from "@/lib/constants";
import { garageCollectionJsonLd } from "@/lib/seo";

function InlinePill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-[21px] translate-y-[-1px] items-center rounded-full border border-[#7B7B7B] px-1.5 pb-px align-middle text-[14px] text-[#A0A0A0]">
      {children}
    </span>
  );
}

export default function GaragePurposePage() {
  return (
    <article className="text-[16px] leading-[1.75] text-[#A0A0A0] 2xl:text-[18px] [&_p+p]:mt-3">
      <JsonLd data={garageCollectionJsonLd()} />
      <GarageBoxPile />

      <hr className="my-10 border-white/10" />

      <p>
        <InlinePill>Garage</InlinePill> is my workbench for interface components, and it&apos;s{" "}
        <span className="text-white">built in the open</span>. Nothing in here is finished. A piece goes up once it works well
        enough to poke at, then I keep tuning it.
      </p>
      <p>
        My day job is mostly systems: flows, states, edge cases, handoff. This is the opposite. One component at a time, no
        deadline, and a lot of time spent on details nobody asked for, even in something as plain as a{" "}
        <Link href={`${ROUTES.garage}/button`} className="hover:underline hover:decoration-white/40 hover:underline-offset-4">
          <ComponentRef own>Button</ComponentRef>
        </Link>
        .
      </p>
      <p>
        Every page has live demos. Press things, flip the controls, and break them on purpose. Struck-through pages in the
        sidebar aren&apos;t built yet.
      </p>
      <p>Leave your email and I&apos;ll let you know when new ones land.</p>

      <div className="mt-4">
        <GarageEmailSignup />
      </div>
    </article>
  );
}
