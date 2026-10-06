import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { Input } from "./Input";

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "padded" },
  // A token search is not personal data, so browser autofill has nothing to
  // offer here.
  args: { placeholder: "Search tokens", "aria-label": "Search tokens", autoComplete: "off" },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Input {...args} size="sm" />
      <Input {...args} size="md" />
    </div>
  ),
};

/** The Figma matrix: Value (Placeholder, Filled) × State. Hover and Focus are
 *  live — point at or Tab to any input. Focus wins over Invalid. */
export const States: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Input {...args} />
      <Input {...args} defaultValue="color/border/focus" />
      <Input {...args} disabled />
      <Input {...args} disabled defaultValue="color/border/focus" />
      <Input {...args} invalid />
      <Input {...args} invalid defaultValue="color/border/focus" />
    </div>
  ),
};

/* --- behaviour tests ---------------------------------------------------------
   Stories with a play function that `npm test` runs. Tagged !autodocs: in the
   sidebar with an Interactions replay, but not on the Docs page, so they have
   no Figma example. */

/** Focus thickens the border to border-width-focus, and the padding gives the
 *  difference back, so neither the text nor the height moves. */
export const FocusKeepsTextInPlace: Story = {
  tags: ["!autodocs", "test"],
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox");
    const measure = () => {
      const style = getComputedStyle(input);
      return {
        border: style.borderLeftWidth,
        textStart: parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft),
        height: input.getBoundingClientRect().height,
      };
    };
    const focusWidth = getComputedStyle(input).getPropertyValue("--sds-border-width-focus").trim();
    const before = measure();

    await userEvent.click(input);
    await expect(input).toHaveFocus();
    const after = measure();

    await expect(after.border).toBe(focusWidth);
    await expect(after.border).not.toBe(before.border);
    await expect(after.textStart).toBe(before.textStart);
    await expect(after.height).toBe(before.height);
  },
};
