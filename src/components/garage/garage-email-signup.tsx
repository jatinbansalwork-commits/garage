"use client";

import { useState, type FormEvent } from "react";
import { trackGarageAction } from "@/lib/analytics";
import { CONTACT_EMAIL } from "@/lib/constants";

export function GarageEmailSignup() {
  const [email, setEmail] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    trackGarageAction({ slug: "purpose", action: "signup" });
    const subject = encodeURIComponent("Garage updates");
    const body = encodeURIComponent(`Add me to the Garage list: ${email}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <form onSubmit={onSubmit} className="border-b border-white/15 transition-colors focus-within:border-white/40">
      <label htmlFor="garage-email" className="sr-only">
        Email address
      </label>
      <input
        id="garage-email"
        type="email"
        required
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@studio.com"
        className="h-12 w-full bg-transparent text-[20px] text-[#EDEDED] caret-[#02BCEA] outline-none placeholder:text-[#606060] placeholder:transition-colors hover:placeholder:text-[#02BCEA] min-[960px]:h-14 min-[960px]:text-[24px]"
      />
    </form>
  );
}
