import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { Switch } from "./Switch";

const meta = {
  title: "Components/Switch",
  component: Switch,
  parameters: { layout: "padded" },
  args: { children: "Sync tokens on save" },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [checked, setChecked] = useState(true);
    return (
      <Switch {...args} checked={checked} onCheckedChange={setChecked}>
        Sync tokens on save ({checked ? "on" : "off"})
      </Switch>
    );
  },
};

/** The Figma matrix: Checked × State. Hover and Focus are live — point at or
 *  Tab to any control. */
export const States: Story = {
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, max-content)", gap: "var(--sds-space-stack-md) var(--sds-space-inline-lg)" }}>
      <Switch>Default</Switch>
      <Switch disabled>Disabled</Switch>
      <Switch defaultChecked>Default</Switch>
      <Switch defaultChecked disabled>Disabled</Switch>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-xs)" }}>
      <Switch disabled>Sync tokens on save</Switch>
      <Switch defaultChecked disabled>Sync tokens on save</Switch>
    </div>
  ),
};

/** A wrapping label hangs from the control: the track centres on the first
 *  line, not on the paragraph. */
export const LongLabel: Story = {
  render: () => (
    <div style={{ maxWidth: "18rem" }}>
      <Switch defaultChecked>
        Rebuild the tokens package whenever a variable changes in Figma
      </Switch>
    </div>
  ),
};

/** Without a label the bare control renders, and needs an accessible name. */
export const WithoutLabel: Story = {
  args: { children: undefined, "aria-label": "Sync tokens on save" },
};

/* ------------------------------------------------------------------------
   Stories with a play function that `npm test` runs. Tagged !autodocs: in the
   sidebar with an Interactions replay, but not on the Docs page, so they have
   no Figma example. */

/** The label toggles the switch, Space toggles it from the keyboard, and the
 *  thumb ends one track height along, at the track's inner edge. */
export const TogglesFromLabelAndKeyboard: Story = {
  tags: ["!autodocs", "test"],
  play: async ({ canvas, userEvent }) => {
    const control = canvas.getByRole("switch", { name: "Sync tokens on save" });
    const track = control.firstElementChild as HTMLElement;
    const thumb = track.firstElementChild as HTMLElement;
    await expect(control).toHaveAttribute("aria-checked", "false");

    await userEvent.click(canvas.getByText("Sync tokens on save"));
    await expect(control).toHaveAttribute("aria-checked", "true");

    await userEvent.keyboard(" ");
    await expect(control).toHaveAttribute("aria-checked", "false");

    await userEvent.keyboard(" ");
    await expect(control).toHaveAttribute("aria-checked", "true");

    // On, once the transition ends: the thumb's end meets the track's content edge.
    await waitFor(() => {
      const style = getComputedStyle(track);
      const contentEnd =
        track.getBoundingClientRect().right -
        parseFloat(style.borderRightWidth) -
        parseFloat(style.paddingRight);
      expect(thumb.getBoundingClientRect().right).toBeCloseTo(contentEnd, 1);
    });
  },
};
