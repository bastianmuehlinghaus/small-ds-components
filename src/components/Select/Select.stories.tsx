import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import * as Dialog from "@radix-ui/react-dialog";
import { Select } from "./Select";
import { Input } from "../Input";

const modes = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System", disabled: true },
];

const tiers = [
  { value: "primitives", label: "Primitives" },
  { value: "semantics", label: "Semantics" },
  { value: "components", label: "Components" },
  { value: "motion", label: "Motion" },
];

const meta: Meta<typeof Select> = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "padded" },
  args: { options: modes, "aria-label": "Mode", placeholder: "Choose a mode" },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Select>;

/** One choice, as radio rows. Choosing one closes the menu. */
export const Single: Story = {};

export const SingleWithValue: Story = {
  args: { defaultValue: "dark" },
};

/** Several choices, as checkbox rows, shown as chips in the field. The menu
 *  stays open while rows are checked, and each chip has a remove button. */
export const Multiple: Story = {
  args: {
    multiple: true,
    options: tiers,
    "aria-label": "Tiers",
    placeholder: "Choose tiers",
    defaultValue: ["primitives", "semantics"],
  },
};

export const MultipleEmpty: Story = {
  args: { multiple: true, options: tiers, "aria-label": "Tiers", placeholder: "Choose tiers" },
};

/** Chips wrap, and the field grows with them. */
export const MultipleWrapping: Story = {
  args: {
    multiple: true,
    options: tiers,
    "aria-label": "Tiers",
    defaultValue: ["primitives", "semantics", "components", "motion"],
  },
  decorators: [(Story) => <div style={{ maxWidth: "15rem" }}><Story /></div>],
};

export const Small: Story = {
  args: { size: "sm", defaultValue: "light" },
};

export const Invalid: Story = {
  args: { invalid: true },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "light" },
};

export const DisabledMultiple: Story = {
  args: {
    disabled: true,
    multiple: true,
    options: tiers,
    "aria-label": "Tiers",
    defaultValue: ["primitives", "semantics"],
  },
};

/* --- behaviour tests ---------------------------------------------------------
   Stories with a play function that `npm test` runs, tagged !autodocs: they
   stay in the sidebar, where the Interactions tab replays them, but not on the
   Docs page. The list renders in a portal on document.body. */

const page = within(document.body);
const closed = () => waitFor(() => expect(page.queryByRole("listbox")).toBeNull());
/** After the transitions have had time to run, the list is still there and open.
 *  Not toBeVisible: a list fading in has opacity 0 and would read as hidden. */
const stillOpen = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300));
  await expect(page.getByRole("listbox").parentElement).toHaveAttribute("data-open");
};

/** A single choice is finished once made: the list closes, the trigger shows
 *  the choice and keeps its name, and focus stays on it. */
export const SingleClosesOnChoice: Story = {
  tags: ["!autodocs", "test"],
  render: function SingleClosesOnChoiceStory() {
    const [value, setValue] = useState<string>();
    return (
      <Select aria-label="Mode" options={modes} placeholder="Choose a mode" value={value} onValueChange={setValue} />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Mode" });
    await expect(trigger).toHaveTextContent("Choose a mode");

    await userEvent.click(trigger);
    // The list is never narrower than the field. offsetWidth, not the
    // bounding box: the list scales in, and the box would be measured mid-way.
    const listbox = await page.findByRole("listbox");
    await expect(listbox.parentElement!.offsetWidth).toBeGreaterThanOrEqual(trigger.offsetWidth);
    await expect(listbox).not.toHaveAttribute("aria-multiselectable", "true");

    await userEvent.click(page.getByRole("option", { name: "Dark" }));
    await closed();
    await expect(trigger).toHaveTextContent("Dark");
    await expect(canvas.getByRole("combobox", { name: "Mode" })).toBe(trigger);
    await expect(trigger).toHaveFocus();
  },
};

/** Several choices are settings: the list stays open, each choice is a chip,
 *  and a chip's remove button works without opening the list. */
export const MultipleChipsAndRemove: Story = {
  tags: ["!autodocs", "test"],
  render: function MultipleChipsAndRemoveStory() {
    const [value, setValue] = useState<string[]>([]);
    return (
      <Select
        multiple
        aria-label="Tiers"
        options={tiers}
        placeholder="Choose tiers"
        value={value}
        onValueChange={setValue}
      />
    );
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("combobox", { name: "Tiers" });
    await expect(trigger).toHaveTextContent("Choose tiers");

    await userEvent.click(trigger);
    const listbox = await page.findByRole("listbox");
    await expect(listbox).toHaveAttribute("aria-multiselectable", "true");
    await userEvent.click(page.getByRole("option", { name: "Primitives" }));
    await userEvent.click(page.getByRole("option", { name: "Motion" }));
    await stillOpen();
    await expect(page.getByRole("option", { name: "Motion" })).toHaveAttribute("aria-selected", "true");

    await userEvent.keyboard("{Escape}");
    await closed();
    // The chips, and the same labels as the combobox's own text.
    await expect(canvas.getByRole("button", { name: "Remove Primitives" })).toBeVisible();
    await expect(canvas.getByRole("button", { name: "Remove Motion" })).toBeVisible();
    await expect(trigger).toHaveTextContent("Primitives, Motion");

    await userEvent.click(canvas.getByRole("button", { name: "Remove Primitives" }));
    await expect(canvas.queryByRole("button", { name: "Remove Primitives" })).toBeNull();
    await expect(trigger).toHaveTextContent("Motion");
    // The remove button took the click: the list did not open, and the focus
    // moved to the trigger instead of vanishing with the chip.
    await expect(page.queryByRole("listbox")).toBeNull();
    await expect(trigger).toHaveFocus();
  },
};

/** A Select submits with its form: one hidden input per chosen value. */
export const SubmitsWithForm: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <form>
      <Select multiple name="tiers" aria-label="Tiers" options={tiers} defaultValue={["primitives", "motion"]} />
    </form>
  ),
  play: async ({ canvasElement }) => {
    const values = [...canvasElement.querySelectorAll<HTMLInputElement>('input[name="tiers"]')].map((i) => i.value);
    await expect(values).toEqual(["primitives", "motion"]);
  },
};

/** Inside a Radix Dialog, a Select needs `portalContainer`: the Dialog makes
 *  everything outside its content unclickable, and the list portals to
 *  document.body. The Dialog also has to let the Select have the first Escape,
 *  which it does by vetoing its own on a combobox that is expanded. Both are
 *  the Dialog's side of the contract; this story is the recipe. */
export const InsideRadixDialog: Story = {
  tags: ["!autodocs", "test"],
  render: function InsideRadixDialogStory() {
    const [container, setContainer] = useState<HTMLElement | null>(null);
    const [mode, setMode] = useState<string>();
    const [tier, setTier] = useState<string[]>([]);
    return (
      <Dialog.Root>
        <Dialog.Trigger>Open dialog</Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)" }} />
          <Dialog.Content
            ref={setContainer}
            onEscapeKeyDown={(event) => {
              const target = event.target as Element | null;
              if (target?.closest('[role="listbox"], [role="combobox"][aria-expanded="true"]')) event.preventDefault();
            }}
            style={{ position: "fixed", top: "10%", left: "20%", width: 320, padding: 24, background: "white" }}
          >
            <Dialog.Title>Settings</Dialog.Title>
            <Dialog.Description>Pick a mode and some tiers.</Dialog.Description>
            <div style={{ display: "grid", gap: 16, margin: "16px 0" }}>
              <Select
                aria-label="Mode"
                options={modes}
                placeholder="Choose a mode"
                value={mode}
                onValueChange={setMode}
                portalContainer={container}
              />
              <Select
                multiple
                aria-label="Tiers"
                options={tiers}
                placeholder="Choose tiers"
                value={tier}
                onValueChange={setTier}
                portalContainer={container}
              />
            </div>
            <Dialog.Close>Close</Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    );
  },
  // Dialog's own chrome here is unstyled scaffolding for the test.
  parameters: { a11y: { test: "todo" } },
  play: async ({ canvas, userEvent }) => {
    const dialog = () => page.queryByRole("dialog");
    await userEvent.click(canvas.getByRole("button", { name: "Open dialog" }));
    await page.findByRole("dialog");

    // Single: the options can be clicked, and choosing one leaves the Dialog open.
    await userEvent.click(page.getByRole("combobox", { name: "Mode" }));
    await userEvent.click(await page.findByRole("option", { name: "Dark" }));
    await closed();
    await expect(dialog()).not.toBeNull();
    await expect(page.getByRole("combobox", { name: "Mode" })).toHaveTextContent("Dark");

    // Multiple: the list stays open while rows are checked.
    await userEvent.click(page.getByRole("combobox", { name: "Tiers" }));
    await userEvent.click(await page.findByRole("option", { name: "Semantics" }));
    await userEvent.click(page.getByRole("option", { name: "Motion" }));
    await stillOpen();
    await expect(dialog()).not.toBeNull();

    // Escape closes the Select first, and only then the Dialog.
    await userEvent.keyboard("{Escape}");
    await closed();
    await expect(dialog()).not.toBeNull();
    await expect(page.getByRole("combobox", { name: "Tiers" })).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(dialog()).toBeNull());
  },
};

/** Next to a text input, a Select is the same height, with or without chips.
 *  It grows only when the chips wrap onto a second row. A chip is 20 high
 *  (`chip/size/height`) so that a row of them fits the field's minimum height
 *  at both sizes; a 24px chip made `sm` 34. */
export const SameHeightAsInput: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <div style={{ display: "grid", gap: "1rem", width: "max-content" }}>
      {(["sm", "md"] as const).map((size) => (
        <div
          key={size}
          data-size={size}
          style={{ display: "grid", gridTemplateColumns: "repeat(4, 15rem)", gap: "0.5rem", alignItems: "start" }}
        >
          <Input size={size} aria-label="Input" placeholder="Input" />
          <Select size={size} aria-label="Single" options={modes} defaultValue="dark" />
          <Select size={size} aria-label="Empty" multiple options={tiers} placeholder="Empty" />
          <Select size={size} aria-label="Chips" multiple options={tiers} defaultValue={["primitives", "semantics"]} />
        </div>
      ))}
    </div>
  ),
  play: async ({ canvasElement }) => {
    for (const row of canvasElement.querySelectorAll<HTMLElement>("[data-size]")) {
      const input = row.querySelector("input")!;
      const fields = [...row.querySelectorAll<HTMLElement>('[role="combobox"]')].map((trigger) => {
        // A multiple Select's trigger is a layer inside its field.
        return trigger.parentElement!.hasAttribute("data-multiple") ? trigger.parentElement! : trigger;
      });
      for (const field of fields) {
        await expect(field.getBoundingClientRect().height).toBe(input.getBoundingClientRect().height);
      }
    }
  },
};
