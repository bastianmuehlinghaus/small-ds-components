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

/** The remove button is two squares: the 16px glyph you see, in a 24px button
 *  you hit (WCAG 2.2, 2.5.8). The button's extra size is cancelled by its
 *  margin, so the chip stays 20 high and the design is unchanged. */
export const RemoveButtonHitArea: Story = {
  tags: ["!autodocs", "test"],
  args: { onRemove: fn() },
  play: async ({ canvas }) => {
    const button = canvas.getByRole("button", { name: "Remove Primitives" });
    const glyph = button.firstElementChild as HTMLElement;
    const chip = button.parentElement as HTMLElement;
    const size = (el: HTMLElement) => [el.offsetWidth, el.offsetHeight];
    await expect(size(button)).toEqual([24, 24]);
    await expect(size(glyph)).toEqual([16, 16]);
    // what you see is unchanged: the chip is as tall as the token says, and the glyph sits 2 from the top and bottom
    await expect(chip.offsetHeight).toBe(20);
    const c = chip.getBoundingClientRect(), g = glyph.getBoundingClientRect();
    await expect([g.top - c.top, c.bottom - g.bottom]).toEqual([2, 2]);
  },
};
