export function DocPageHeader({
  title,
  lede,
}: {
  title: string;
  lede: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      <p className="mb-2 text-[13px] tracking-[0.04em] text-white/35">Docs/</p>
      <h2 className="text-[28px] font-medium leading-tight tracking-[-0.01em] text-[#EDEDED] sm:text-[32px]">
        {title}
      </h2>
      <p className="mt-3 max-w-[42rem] text-[16px] leading-[1.65] text-[#A0A0A0] 2xl:text-[18px]">{lede}</p>
    </header>
  );
}
