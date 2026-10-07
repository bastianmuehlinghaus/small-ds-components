import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Chip } from "./Chip";

const meta = {
  title: "Components/Chip",
  component: Chip,
  parameters: { layout: "padded" },
  args: { children: "Primitives" },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** `onRemove` adds the remove button. Its name reads "Remove" + the label. */
export const Removable: Story = {
  args: { onRemove: fn() },
};

export const Disabled: Story = {
  args: { onRemove: fn(), disabled: true },
};

/** A long label truncates inside the space it has, rather than stretching its field. */
export const LongLabel: Story = {
  args: { onRemove: fn(), children: "Semantic colour tokens for content, border and background" },
  decorators: [(Story) => <div style={{ maxWidth: "12rem" }}><Story /></div>],
};

/** The remove button is named for its chip, so a row of chips doesn't read as
 *  a row of identical "Remove" buttons. */
export const RemoveButtonIsNamed: Story = {
  tags: ["!autodocs", "test"],
  args: { onRemove: fn() },
  play: async ({ canvas, args, userEvent }) => {
    const button = canvas.getByRole("button", { name: "Remove Primitives" });
    await userEvent.click(button);
    await expect(args.onRemove).toHaveBeenCalledTimes(1);
  },
};
