import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import * as Dialog from "@radix-ui/react-dialog";
import { Select } from "./Select";
import { Input } from "../Input";
import { Button } from "../Button";

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
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "A select field. The list it opens is a **listbox** (`role=\"listbox\"` with `option`s), not a menu: " +
          "its rows are values you choose, not actions you run, which is what screen readers, type-ahead and " +
          "forms expect of a select. It looks like DropdownMenu with checkbox or radio rows because it reuses their " +
          "row styles, and it is a different pattern. A single choice closes the list; `multiple` keeps it open and " +
          "shows the choices as chips. In Figma it is specified by the Listbox page.",
      },
    },
  },
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

/* --- open ----------------------------------------------------------------
   The list rendered at rest, so its surface and rows can be seen without
   interacting, as DropdownMenu's OpenByDefault does. Tagged !autodocs: an open
   Select is modal and locks the page, and a Docs page can show only one, so
   these stay in the sidebar. The decorator reserves room, because the list
   renders in a portal and would otherwise cover the page's own content. */

const room = (Story: () => React.ReactElement) => (
  <div style={{ maxWidth: "15rem", minHeight: "14rem" }}>
    <Story />
  </div>
);

/** Single choice: radio rows, with one chosen. */
export const SingleOpen: Story = {
  tags: ["!autodocs"],
  args: { defaultOpen: true, defaultValue: "dark" },
  decorators: [room],
};

/** Several choices: checkbox rows, with the chosen ones shown as chips. */
export const MultipleOpen: Story = {
  tags: ["!autodocs"],
  args: {
    multiple: true,
    defaultOpen: true,
    options: tiers,
    "aria-label": "Tiers",
    placeholder: "Choose tiers",
    defaultValue: ["primitives", "semantics"],
  },
  decorators: [room],
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

/** Focus keeps the border's width and adds Input's inset ring, so neither a
 *  single Select's value nor a multiple Select's chips move. Before the ring,
 *  the chips moved 1px in the Figma Focus variant. */
export const FocusKeepsContentInPlace: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Select aria-label="Mode" options={modes} defaultValue="dark" />
      <Select multiple aria-label="Tiers" options={tiers} defaultValue={["primitives", "semantics"]} />
    </div>
  ),
  play: async ({ canvas }) => {
    const check = async (trigger: HTMLElement, content: HTMLElement) => {
      const measure = () => ({
        border: getComputedStyle(trigger).borderLeftWidth,
        ring: getComputedStyle(trigger).boxShadow,
        content: content.getBoundingClientRect(),
        field: trigger.getBoundingClientRect(),
      });
      const before = measure();
      trigger.focus();
      await expect(trigger).toHaveFocus();
      const after = measure();

      await expect(before.ring).toBe("none");
      await waitFor(() => {
        const style = getComputedStyle(trigger);
        expect(style.boxShadow).toBe(`${style.borderLeftColor} 0px 0px 0px ${style.borderLeftWidth} inset`);
      });
      await expect(after.border).toBe(before.border);
      await expect(after.content.x).toBe(before.content.x);
      await expect(after.content.y).toBe(before.content.y);
      await expect(after.field.height).toBe(before.field.height);
      trigger.blur();
    };

    const single = canvas.getByRole("combobox", { name: "Mode" });
    await check(single, within(single).getByText("Dark"));

    const multiple = canvas.getByRole("combobox", { name: "Tiers" });
    await check(multiple, canvas.getByRole("button", { name: "Remove Primitives" }));
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

/** Every control is one height, `size/control/default`, so a row of them
 *  aligns: Input, Button and Select, with or without chips. A Select grows
 *  only when its chips wrap onto a second row. A chip is 20 high
 *  (`chip/size/height`) so that a row of them fits; a 24px chip made it 34. */
export const ControlsShareOneHeight: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 15rem) max-content", gap: "0.5rem", alignItems: "start" }}>
      <Input aria-label="Input" placeholder="Input" />
      <Select aria-label="Single" options={modes} defaultValue="dark" />
      <Select aria-label="Chips" multiple options={tiers} defaultValue={["primitives", "semantics"]} />
      <Button variant="primary">Apply</Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const control = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--sds-size-control-default"),
    );
    const fields = [...canvasElement.querySelectorAll<HTMLElement>('[role="combobox"]')].map((trigger) =>
      // A multiple Select's trigger is a layer inside its field.
      trigger.parentElement!.hasAttribute("data-multiple") ? trigger.parentElement! : trigger,
    );
    const button = [...canvasElement.querySelectorAll("button")].find((b) => b.textContent === "Apply")!;
    const controls = [canvasElement.querySelector("input")!, ...fields, button];
    await expect(controls).toHaveLength(4);
    for (const el of controls) await expect(el.getBoundingClientRect().height).toBe(control);
  },
};
