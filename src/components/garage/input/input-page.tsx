"use client";

import { useState } from "react";
import { DOT_COLOR, SearchIcon } from "@/components/garage/button/button-demos";
import {
  BUTTON_COLORS,
  BUTTON_SHAPES,
  BUTTON_SIZES,
  type ButtonColor,
  type ButtonShape,
  type ButtonSize,
} from "@/components/garage/button/garage-button";
import {
  CautionTape,
  Checkbox,
  Code,
  CodeBlock,
  DataTable,
  DemoStage,
  GarageSection,
  PropRow,
  Segmented,
} from "@/components/garage/garage-ui";
import { GarageInput, INPUT_VARIANTS, type InputVariant } from "@/components/garage/input/garage-input";

const SAMPLE = {
  label: "Search projects",
  prefix: "₹",
  suffix: "@gmail",
  helpText: "Try a client, a year or a tool.",
  error: "Nothing matches that search.",
};

interface PlaygroundState {
  variant: InputVariant;
  size: ButtonSize;
  color: ButtonColor;
  shape: ButtonShape;
  loading: boolean;
  disabled: boolean;
  showLabel: boolean;
  icon: boolean;
  prefix: boolean;
  suffix: boolean;
  clearable: boolean;
  helpText: boolean;
  error: boolean;
}

function playgroundCode(props: PlaygroundState) {
  const attrs = [
    `label="${SAMPLE.label}"`,
    props.showLabel && "showLabel",
    props.variant !== "outline" && `variant="${props.variant}"`,
    props.color !== "accent" && `color="${props.color}"`,
    props.size !== "medium" && `size="${props.size}"`,
    props.shape !== "square" && `shape="${props.shape}"`,
    props.icon && "icon={<Search />}",
    props.prefix && `prefix="${SAMPLE.prefix}"`,
    props.suffix && `suffix="${SAMPLE.suffix}"`,
    props.clearable && "clearable",
    props.helpText && `helpText="${SAMPLE.helpText}"`,
    props.error && `error="${SAMPLE.error}"`,
    props.loading && "loading",
    props.disabled && "disabled",
  ].filter(Boolean);
  return attrs.length > 3 ? `<Input\n${attrs.map((attr) => `  ${attr}`).join("\n")}\n/>` : `<Input ${attrs.join(" ")} />`;
}

const ANATOMY_ROWS = [
  ["Label", <Code key="c">label</Code>, "Always set. Hidden from sight unless showLabel is on, but still read out."],
  ["Icon", <Code key="c">icon</Code>, "A leading glyph, like the search glass."],
  ["Prefix", <Code key="c">prefix</Code>, "Fixed text before the value, like a currency symbol."],
  ["Value", <Code key="c">value</Code>, "What the person types."],
  ["Clear", <Code key="c">clearable</Code>, "Appears once there's a value. It's a real button, so it can be tabbed to."],
  ["Suffix", <Code key="c">suffix</Code>, "Fixed text after the value, like an email domain."],
  ["Help text", <Code key="c">helpText</Code>, "Linked with aria-describedby, so it's read after the label."],
  ["Error", <Code key="c">error</Code>, "Takes the help text's place, turns the border red and sets aria-invalid."],
] as const;

function AnatomyDemo() {
  const [value, setValue] = useState("Value");
  return (
    <DemoStage height={220}>
      <GarageInput
        value={value}
        onChange={setValue}
        label="Label"
        showLabel
        icon={<SearchIcon />}
        prefix="₹"
        suffix="@gmail"
        clearable
        helpText="Help text"
        placeholder="Value"
        className="w-[min(80%,340px)]"
      />
    </DemoStage>
  );
}

function InputPlayground() {
  const [value, setValue] = useState("Policy Copilot");
  const [variant, setVariant] = useState<InputVariant>("outline");
  const [size, setSize] = useState<ButtonSize>("medium");
  const [color, setColor] = useState<ButtonColor>("accent");
  const [shape, setShape] = useState<ButtonShape>("square");
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [showLabel, setShowLabel] = useState(true);
  const [icon, setIcon] = useState(true);
  const [prefix, setPrefix] = useState(false);
  const [suffix, setSuffix] = useState(false);
  const [clearable, setClearable] = useState(true);
  const [helpText, setHelpText] = useState(true);
  const [error, setError] = useState(false);
  const code = playgroundCode({
    variant,
    size,
    color,
    shape,
    loading,
    disabled,
    showLabel,
    icon,
    prefix,
    suffix,
    clearable,
    helpText,
    error,
  });

  return (
    <div>
      <DemoStage height={400} className="!mt-0">
        <CautionTape />
        <GarageInput
          value={value}
          onChange={setValue}
          variant={variant}
          size={size}
          color={color}
          shape={shape}
          loading={loading}
          disabled={disabled}
          label={SAMPLE.label}
          showLabel={showLabel}
          icon={icon ? <SearchIcon /> : undefined}
          prefix={prefix ? SAMPLE.prefix : undefined}
          suffix={suffix ? SAMPLE.suffix : undefined}
          clearable={clearable}
          helpText={helpText ? SAMPLE.helpText : undefined}
          error={error ? SAMPLE.error : undefined}
          placeholder={SAMPLE.label}
          loadingLabel="Searching"
          className="w-[min(80%,340px)]"
        />
      </DemoStage>

      <div className="mt-6">
        <PropRow name="variant" options={INPUT_VARIANTS.join(" | ")}>
          <Segmented id="input-variant" label="Variant" options={INPUT_VARIANTS} value={variant} onChange={setVariant} />
        </PropRow>
        <PropRow name="size" options={BUTTON_SIZES.join(" | ")}>
          <Segmented id="input-size" label="Size" options={BUTTON_SIZES} value={size} onChange={setSize} />
        </PropRow>
        <PropRow name="color" options={BUTTON_COLORS.join(" | ")}>
          <Segmented
            id="input-color"
            label="Colour"
            options={BUTTON_COLORS}
            value={color}
            onChange={setColor}
            renderOption={(option) => (
              <span className="block size-[7px] rounded-full" style={{ backgroundColor: DOT_COLOR[option] }} />
            )}
          />
        </PropRow>
        <PropRow name="shape" options={BUTTON_SHAPES.join(" | ")}>
          <Segmented id="input-shape" label="Shape" options={BUTTON_SHAPES} value={shape} onChange={setShape} />
        </PropRow>
        <PropRow name="loading" options="boolean">
          <Checkbox label="Loading" checked={loading} onChange={setLoading} />
        </PropRow>
        <PropRow name="disabled" options="boolean">
          <Checkbox label="Disabled" checked={disabled} onChange={setDisabled} />
        </PropRow>
        <PropRow name="showLabel" options="boolean">
          <Checkbox label="Show label" checked={showLabel} onChange={setShowLabel} />
        </PropRow>
        <PropRow name="icon" options="ReactNode">
          <Checkbox label="Icon" checked={icon} onChange={setIcon} />
        </PropRow>
        <PropRow name="prefix" options="string">
          <Checkbox label="Prefix" checked={prefix} onChange={setPrefix} />
        </PropRow>
        <PropRow name="suffix" options="string">
          <Checkbox label="Suffix" checked={suffix} onChange={setSuffix} />
        </PropRow>
        <PropRow name="clearable" options="boolean">
          <Checkbox label="Clearable" checked={clearable} onChange={setClearable} />
        </PropRow>
        <PropRow name="helpText" options="string">
          <Checkbox label="Help text" checked={helpText} onChange={setHelpText} />
        </PropRow>
        <PropRow name="error" options="string">
          <Checkbox label="Error" checked={error} onChange={setError} />
        </PropRow>
      </div>

      <div className="mt-6">
        <CodeBlock copy={code}>{code}</CodeBlock>
      </div>
    </div>
  );
}

export function GarageInputPage() {
  return (
    <article className="text-[16px] leading-[1.75] text-[#A0A0A0] 2xl:text-[18px] [&_p+p]:mt-2">
      <InputPlayground />

      <GarageSection title="Anatomy">
        <p>
          Every part an input can carry, all switched on at once. Real fields only use a few. You&apos;d never put a currency
          symbol and an email domain in the same one.
        </p>
        <AnatomyDemo />
        <DataTable head={["Part", "Prop", "Notes"]} rows={ANATOMY_ROWS} />
      </GarageSection>
    </article>
  );
}
