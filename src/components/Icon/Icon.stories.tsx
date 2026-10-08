import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckmarkIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, CloseIcon, DashIcon } from "./Icon";

const meta = {
  title: "Components/Icons",
  parameters: { layout: "padded" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* The same Icon components as the Figma components file, under the
   same names. */
const icons = [
  { name: "chevron-right", Icon: ChevronRightIcon },
  { name: "chevron-down", Icon: ChevronDownIcon },
  { name: "chevron-up", Icon: ChevronUpIcon },
  { name: "checkmark", Icon: CheckmarkIcon },
  { name: "dash", Icon: DashIcon },
  { name: "close", Icon: CloseIcon },
];

const Grid = ({ size }: { size?: string }) => (
  <div style={{ display: "flex", gap: "2rem", alignItems: "flex-end", flexWrap: "wrap" }}>
    {icons.map(({ name, Icon }) => (
      <figure key={name} style={{ margin: 0, display: "grid", justifyItems: "center", gap: "0.5rem" }}>
        <Icon style={size ? { width: size, height: size } : undefined} />
        <figcaption style={{ font: "inherit", fontSize: "0.75rem" }}>{name}</figcaption>
      </figure>
    ))}
  </div>
);

/** Native size: 16px, `--sds-size-icon-sm`, as in Figma. */
export const All: Story = {
  render: () => <Grid />,
};

/** The three icon sizes: 16 (Button, Menu item, Checkbox, Chip), 20 (Accordion) and 24, which no component draws an icon at today. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      <Grid size="var(--sds-size-icon-sm)" />
      <Grid size="var(--sds-size-icon-md)" />
      <Grid size="var(--sds-size-icon-lg)" />
    </div>
  ),
};
