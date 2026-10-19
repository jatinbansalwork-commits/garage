import {
  AffixDemo,
  AnnounceDemo,
  ButtonGroupDemo,
  ButtonPlayground,
  DisabledDemo,
  FeedbackDemo,
  ForcePressDemo,
  FullWidthDemo,
  IconOnlyDemo,
  KeyboardPressDemo,
  LightDarkDemo,
  LoadingDemo,
  ReducedMotionDemo,
  RenderDemo,
  RtlDemo,
  SingleButtonDemo,
  SoundDemo,
  SpinnerDemo,
  SplitButtonDemo,
  TouchPressDemo,
  UsageColourDemo,
  UsageDisabledDemo,
  UsageEmphasisDemo,
  VariantRowDemo,
  WidthDemo,
} from "@/components/garage/button/button-demos";
import { Code, ComponentRef, DataTable, GarageSection, SourceViewer } from "@/components/garage/garage-ui";
import type { SourceFile } from "@/lib/garage-source";

const PROP_ROWS = [
  ["variant", "solid | soft | outline | ghost", "solid", "Appearance only. Never changes the colour."],
  ["color", "accent | blue | red | amber | black", "accent", "Hue for every variant."],
  ["size", "micro | tiny | small | medium | large", "medium", "Height from 26px to 40px."],
  ["shape", "sharp | square | round", "square", "Sharp is 0 radius. Round makes it a pill."],
  ["theme", "dark | light", "dark", "Surface it sits on. Light surfaces darken on press."],
  ["loading", "boolean", "false", "Shows the spinner and blocks clicks without greying out."],
  ["loadingLabel", "string", "Loading", "Announced to screen readers when loading starts."],
  ["feedback", "success | error | null", "null", "Post-press check or cross. Holds the button until you clear it."],
  ["feedbackLabel", "string", "–", "Announced when feedback flips on."],
  ["disabled", "boolean", "false", "Greys out and blocks clicks. Stays in the tab order."],
  ["disabledReason", "string", "–", "Explains a disabled button via title and aria-describedby."],
  ["fullWidth", "boolean", "false", "Stretch to the parent width."],
  ["prefix / suffix", "ReactNode", "–", "Slots before and after the label, for icons or a Kbd."],
  ["icon", "boolean", "false", "Square icon-only button. Needs aria-label."],
  ["aria-label", "string", "–", "Accessible name. Required with icon."],
  ["render", "ReactElement", "<button>", "Element to render instead, such as a Link."],
  ["sound", "boolean", "false", "Click sound on desktop, short vibration on Android."],
  ["dynamicSpinner", "boolean", "true", "Spinner changes arc and speed every turn."],
  ["reducedMotion", "boolean", "system", "Overrides prefers-reduced-motion."],
  ["pressed", "boolean", "–", "Forces the pressed look, for demos."],
] as const;

const TEST_ROWS = [
  ["Chrome on macOS", "Checked", "Where it was built and tuned."],
  ["Forced colours", "Emulated", "Chrome DevTools forced-colors: active. Borders hold on every variant."],
  ["Reduced motion", "Emulated", "Chrome DevTools prefers-reduced-motion: reduce."],
  ["Right-to-left", "Checked", 'dir="rtl" in Chrome, shown above.'],
  ["44px tap area", "Checked", "Measured in Chrome. A tap 9px above a 26px button still lands on it."],
] as const;

export function GarageButtonPage({ sources }: { sources: readonly SourceFile[] }) {
  return (
    <article className="text-[16px] leading-[1.75] text-[#A0A0A0] 2xl:text-[18px] [&_p+p]:mt-2">
      <ButtonPlayground />

      <GarageSection title="Component Design">
        <p>
          Most <ComponentRef>Button</ComponentRef> APIs give you two knobs: <Code>variant</Code> and <Code>size</Code>. The
          main action on a page usually ends up as <Code>variant=&quot;primary&quot;</Code>:
        </p>
        <SingleButtonDemo>Primary</SingleButtonDemo>
        <p>
          That holds up until the primary button is too loud for where it sits. It should still read as the main action, but
          the variant has already chosen the colour for you.
        </p>
        <p>
          So you reach for <Code>variant=&quot;secondary&quot;</Code>, which in most libraries means grey and quiet:
        </p>
        <SingleButtonDemo variant="outline" color="black">
          Secondary
        </SingleButtonDemo>
        <p>
          This <ComponentRef own>Button</ComponentRef> splits the decision into three props: <Code>variant</Code>,{" "}
          <Code>color</Code> and <Code>size</Code>.
        </p>
        <p>
          Variant only sets the appearance, never the colour. So one primary colour can show up four ways, each suited to a
          different kind of interface.
        </p>
        <VariantRowDemo />
        <p>
          With five colours, <Code>accent</Code>, <Code>red</Code>, <Code>blue</Code>, <Code>amber</Code> and{" "}
          <Code>black</Code>, the combinations add up quickly.
        </p>
      </GarageSection>

      <GarageSection title="Feature Showcase">
        <p>Loading slides in instead of swapping the label out</p>
        <LoadingDemo />
        <p>
          The spinner animates <Code>margin-left</Code> on an inner element, so the button&apos;s width follows along with no{" "}
          <Code>ResizeObserver</Code>
        </p>
        <WidthDemo />
        <p>
          Prefix and suffix slots, with room for pieces like <ComponentRef>Kbd</ComponentRef> and{" "}
          <ComponentRef>Tooltip</ComponentRef>
        </p>
        <AffixDemo />
        <p>
          Swap the rendered element with the <Code>render</Code> prop
        </p>
        <RenderDemo />
        <p>
          On light surfaces <ComponentRef own>Button</ComponentRef> darkens when pressed. On dark surfaces and inverted
          variants it lightens instead.
        </p>
        <LightDarkDemo />
        <p>
          Every variant has its own sound. It stays off on touch devices, where a UI sound can pause whatever music is already
          playing.
        </p>
        <SoundDemo />
      </GarageSection>

      <GarageSection title="Layouts">
        <p>
          The same <ComponentRef own>Button</ComponentRef> has to work in places other than a lone call to action. These are
          the layouts it gets dropped into most often.
        </p>
        <p>
          Icon-only buttons drop the visible label, but never the name. The <Code>aria-label</Code> is what a screen reader
          says instead, and in development the button warns in the console when it&apos;s missing.
        </p>
        <IconOnlyDemo />
        <p>
          Groups join neighbouring buttons into one shape. Inner corners go square, borders overlap by a pixel so they
          don&apos;t double up, and the arrow keys move along the group like a toolbar.
        </p>
        <ButtonGroupDemo />
        <p>
          A split button pairs the main action with a menu of related ones. The trigger has its own label and{" "}
          <Code>aria-expanded</Code>, the menu takes focus when it opens, and <Code>Escape</Code> hands focus back.
        </p>
        <SplitButtonDemo />
        <p>
          On a phone, the main action stretches to the full width so it&apos;s easy to reach with a thumb.{" "}
          <Code>fullWidth</Code> does that; from <Code>sm</Code> up you can override with a width class.
        </p>
        <FullWidthDemo />
      </GarageSection>

      <GarageSection title="Force Press">
        <p>
          Safari on macOS fires a non-standard <Code>webkitmouseforcedown</Code> event when a trackpad click pushes past a
          pressure threshold.
        </p>
        <p>
          When it fires, the button sinks one step further, from <Code>0.97</Code> to <Code>0.94</Code>.
        </p>
        <ForcePressDemo />
        <p>It needs a pressure-sensitive Apple trackpad, so everyone else simply gets the normal press.</p>
      </GarageSection>

      <GarageSection title="Dynamic Spinner">
        <p>
          Instead of one fixed loop, the spinner picks a new arc length and speed after every turn, so it never looks like a GIF
          on repeat.
        </p>
        <SpinnerDemo />
      </GarageSection>

      <GarageSection title="After the Press">
        <p>
          Loading covers the wait. It doesn&apos;t say what happened when the wait ended.{" "}
          <Code>feedback=&quot;success&quot;</Code> or <Code>feedback=&quot;error&quot;</Code> paints the button, swaps the
          spinner for a check or a cross, and announces the outcome. Clear it when the next press should be allowed.
        </p>
        <FeedbackDemo />
        <p>
          Pair it with <Code>loading</Code> for the full trip: press → wait → done.{" "}
          <Code>feedbackLabel</Code> sets what a screen reader hears, the same way <Code>loadingLabel</Code> does for the wait.
        </p>
      </GarageSection>

      <GarageSection title="Disabled States">
        <p>
          Buttons have two states that often get bundled together: <Code>loading</Code> and <Code>disabled</Code>. Plenty of
          libraries switch both on while a request is in flight.
        </p>
        <DisabledDemo grey />
        <p>
          I keep them apart. A loading button should stop responding to clicks, but it doesn&apos;t need to look disabled.
        </p>
        <p>
          Holding on to the colour avoids a jarring flash from blue to grey. The only change is the{" "}
          <Code>not-allowed</Code> cursor.
        </p>
        <DisabledDemo grey={false} />
        <p>
          A spinner isn&apos;t enough for keyboard and screen reader users, so the button gives them a stronger signal: it
          keeps focus, reports itself as busy, and says what it&apos;s doing out loud. More on that in{" "}
          <a href="#section-accessibility" className="text-white underline decoration-white/30 underline-offset-4 hover:decoration-white">
            Accessibility
          </a>
          .
        </p>
      </GarageSection>

      <GarageSection id="section-accessibility" title="Accessibility">
        <p>
          A press should feel the same whether it comes from a trackpad, a keyboard or a screen reader. Most of the work here
          is making sure nothing important only happens for the mouse.
        </p>
        <p>
          Holding <Code>Space</Code> or <Code>Enter</Code> sinks the button exactly like a click does. Key repeats are
          ignored, so holding a key down doesn&apos;t fire the sound over and over.
        </p>
        <KeyboardPressDemo />
        <p>
          Loading and disabled use <Code>aria-busy</Code> and <Code>aria-disabled</Code> instead of the native{" "}
          <Code>disabled</Code> attribute. The button stays in the tab order, so focus doesn&apos;t get thrown back to the top
          of the page the moment a request starts.
        </p>
        <p>
          The spinner and feedback icons are decorative, so a polite live region says what&apos;s happening instead. The wording
          is a prop: <Code>loadingLabel=&quot;Sending&quot;</Code>, and the same idea for{" "}
          <Code>feedbackLabel</Code> after the press.
        </p>
        <AnnounceDemo />
        <p>
          In Windows high contrast mode, every variant falls back to a system border, so ghost buttons don&apos;t vanish when
          the background colours are stripped out.
        </p>
        <p>
          The smaller sizes are easy to miss with a thumb, so every button has an invisible tap area of at least 44px. It
          sits outside the visible edge, so a 26px button still looks like a 26px button.
        </p>
      </GarageSection>

      <GarageSection title="Reduced Motion">
        <p>
          Some people switch animations off at the system level because movement makes them feel unwell, or just gets in the
          way. The button reads <Code>prefers-reduced-motion</Code> and calms itself down to match.
        </p>
        <p>
          The press stops scaling and only the colour changes. The spinner keeps a steady pace instead of picking a new
          rhythm every turn, the loading slot fades in instead of sliding, and the sounds stay off.
        </p>
        <ReducedMotionDemo />
        <p>
          The <Code>reducedMotion</Code> prop overrides the system setting, which is how this demo shows both versions side by
          side.
        </p>
      </GarageSection>

      <GarageSection title="Touch">
        <p>
          The press was tuned on a trackpad, where the pointer sits beside the button and you can watch it sink. On a phone
          your thumb covers the button, and a quick tap is often over before a single frame of the press is visible.
        </p>
        <p>
          So touch presses go one step deeper, to <Code>0.95</Code>, and hold for at least <Code>110ms</Code> even when the
          tap is shorter. The release is the part you actually see as your thumb lifts, so it needs something to come back
          from.
        </p>
        <TouchPressDemo />
        <p>
          If the press turns into a scroll, the browser fires <Code>pointercancel</Code> and the button lets go straight away,
          so swiping past a column of buttons doesn&apos;t flash every one of them.
        </p>
        <p>
          Sound stays off on phones, but on Android a short <Code>navigator.vibrate(8)</Code> takes its place. iOS
          doesn&apos;t expose vibration to the web, so iPhones get the visual press on its own.
        </p>
        <p>
          <Code>touch-action: manipulation</Code> removes the double-tap-to-zoom delay, and the grey tap highlight is switched
          off because the button already has a pressed state of its own.
        </p>
      </GarageSection>

      <GarageSection title="Props">
        <p>
          Everything the <ComponentRef own>Button</ComponentRef> accepts. Every snippet on this page has a copy button, and the
          playground at the top writes out the code for whatever you&apos;ve set. The full source is right below.
        </p>
        <DataTable head={["Prop", "Type", "Default", "Description"]} rows={PROP_ROWS} />
      </GarageSection>

      <GarageSection title="Source">
        <p>
          The whole component, as three files. It only depends on React and <Code>framer-motion</Code>. Update the{" "}
          <Code>@/</Code> import paths to match your project.
        </p>
        <SourceViewer files={sources} />
      </GarageSection>

      <GarageSection title="Usage">
        <p>The props allow plenty of combinations that technically work and still read badly. Three rules cover most of them.</p>
        <UsageEmphasisDemo />
        <UsageColourDemo />
        <UsageDisabledDemo />
      </GarageSection>

      <GarageSection title="Testing">
        <p>
          Right-to-left layouts flip on their own. The spinner slot uses <Code>margin-inline-start</Code> instead of{" "}
          <Code>margin-left</Code>, so it slides in from the correct side, and prefix and suffix swap ends with the text.
        </p>
        <RtlDemo />
        <p>
          Here&apos;s where it has been checked. Emulated means a browser&apos;s developer tools, not the real thing. Anything
          that turns up in another browser or screen reader gets fixed here.
        </p>
        <DataTable head={["Environment", "Status", "Notes"]} rows={TEST_ROWS} />
      </GarageSection>
    </article>
  );
}
