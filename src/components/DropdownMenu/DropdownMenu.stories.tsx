import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { DropdownMenu } from "./DropdownMenu";
import { Button } from "../Button";

const meta = {
  title: "Components/DropdownMenu",
  component: DropdownMenu.Content,
  parameters: { layout: "padded" },
} satisfies Meta<typeof DropdownMenu.Content>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit tokens</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Publish library</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

/** Checkbox and radio rows lead with the same box as Checkbox and RadioGroup; checked rows get no selected background. */
export const WithSelection: Story = {
  render: function WithSelectionStory() {
    const [showPrimitives, setShowPrimitives] = useState(true);
    const [showDeprecated, setShowDeprecated] = useState(false);
    const [mode, setMode] = useState("light");

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">View options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Show</DropdownMenu.Label>
          <DropdownMenu.CheckboxItem checked={showPrimitives} onCheckedChange={setShowPrimitives}>
            Primitives
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.CheckboxItem checked={showDeprecated} onCheckedChange={setShowDeprecated}>
            Deprecated tokens
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Label>Mode</DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={mode} onValueChange={setMode}>
            <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="system">System</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
};

/** A "select all" row goes indeterminate while only some rows are checked.
 *  Checkbox rows keep the menu open, so the parent can be watched. */
export const SelectAll: Story = {
  render: function SelectAllStory() {
    const [tiers, setTiers] = useState({ primitives: true, semantics: false, components: true });
    const values = Object.values(tiers);
    const all = values.every(Boolean) ? true : values.some(Boolean) ? "indeterminate" : false;

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">Export tiers</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem
            checked={all}
            onCheckedChange={(next) =>
              setTiers({ primitives: next, semantics: next, components: next })
            }
          >
            All tiers
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          {(Object.keys(tiers) as Array<keyof typeof tiers>).map((key) => (
            <DropdownMenu.CheckboxItem
              key={key}
              checked={tiers[key]}
                onCheckedChange={(next) => setTiers({ ...tiers, [key]: next })}
            >
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
};

export const WithSubmenu: Story = {
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Export</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Copy variable name</DropdownMenu.Item>
        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger>Export as</DropdownMenu.SubTrigger>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item>CSS custom properties</DropdownMenu.Item>
            <DropdownMenu.Item>JSON (DTCG)</DropdownMenu.Item>
            <DropdownMenu.Item>TypeScript</DropdownMenu.Item>
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Open in Figma</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

/** Open by default, so the surface tokens are visible without interacting. */
export const OpenByDefault: Story = {
  parameters: {
    a11y: {
      config: {
        /**
         * Radix menus are modal by default: while open, they set aria-hidden on
         * everything outside the portal, including the still-focusable trigger.
         * axe flags that as aria-hidden-focus, but focus is trapped inside the
         * menu — verified that Tab cannot reach the trigger while it is open —
         * so the condition axe is guarding against cannot occur.
         *
         * Scoped to this story alone. Every other DropdownMenu story renders
         * closed and keeps the rule enforced.
         */
        rules: [{ id: "aria-hidden-focus", enabled: false }],
      },
    },
  },
  render: () => (
    <DropdownMenu.Root defaultOpen>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Label>Tokens</DropdownMenu.Label>
        <DropdownMenu.Item>Edit tokens</DropdownMenu.Item>
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Item disabled>Publish library</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Delete</DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
};

/* --- behaviour tests ---------------------------------------------------------
   Stories with a play function that `npm test` runs. Tagged !autodocs: they
   stay in the sidebar, where the Interactions tab replays them step by step,
   but not on the Docs page, so they have no Figma example. Each closes its
   menu before it ends, so axe checks the page with the menu closed; Radix's
   aria-hidden on an open modal menu is covered by OpenByDefault. */

/** The menu renders in a portal on document.body, outside the story canvas. */
const page = within(document.body);

/** A Button that opens a menu holds the pressed overlay until the menu closes. */
export const TriggerStaysPressed: Story = {
  tags: ["!autodocs", "test"],
  render: Basic.render,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Open menu" });
    // Compared as custom properties, not the painted colour, so the overlay's
    // transition can't make the test flaky.
    const overlay = () => getComputedStyle(trigger).getPropertyValue("--sds-button-overlay").trim();
    const pressed = getComputedStyle(trigger)
      .getPropertyValue("--sds-button-secondary-color-overlay-pressed")
      .trim();

    await userEvent.click(trigger);
    await page.findByRole("menu");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(overlay()).toBe(pressed);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(overlay()).not.toBe(pressed);
  },
};

/** A group label divides groups on its own, so a separator right before one is
 *  hidden, whether the label stands alone or opens a Group. */
export const NoSeparatorBeforeGroupLabel: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <Button variant="secondary">Open menu</Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item>Edit tokens</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Label>Show</DropdownMenu.Label>
        <DropdownMenu.Item>Primitives</DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Group>
          <DropdownMenu.Label>Mode</DropdownMenu.Label>
          <DropdownMenu.Item>Light</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ),
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open menu" }));
    await page.findByRole("menu");

    // hidden: true, because a display: none separator leaves the accessibility
    // tree. display itself is asserted, not visibility: the menu fades in, and
    // a see-through ancestor would read as invisible either way.
    const [beforeItem, beforeLabel, beforeGroup] = page.getAllByRole("separator", { hidden: true });
    const display = (el: HTMLElement | undefined) => (el ? getComputedStyle(el).display : "missing");
    await expect(display(beforeItem)).not.toBe("none");
    await expect(display(beforeLabel)).toBe("none");
    await expect(display(beforeGroup)).toBe("none");

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page.queryByRole("menu")).toBeNull());
  },
};

/** Checkbox and radio rows are settings: choosing one keeps the menu open. A
 *  plain item, an outside press and Escape still close it. */
export const SelectionKeepsMenuOpen: Story = {
  tags: ["!autodocs", "test"],
  render: function SelectionKeepsMenuOpenStory() {
    const [primitives, setPrimitives] = useState(false);
    const [mode, setMode] = useState("light");

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Button variant="secondary">View options</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.CheckboxItem checked={primitives} onCheckedChange={setPrimitives}>
            Primitives
          </DropdownMenu.CheckboxItem>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup value={mode} onValueChange={setMode}>
            <DropdownMenu.RadioItem value="light">Light</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem value="dark">Dark</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>Reset view</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "View options" });
    const closed = () => waitFor(() => expect(page.queryByRole("menu")).toBeNull());

    await userEvent.click(trigger);
    const menu = await page.findByRole("menu");

    await userEvent.click(page.getByRole("menuitemcheckbox", { name: "Primitives" }));
    await expect(page.getByRole("menuitemcheckbox", { name: "Primitives" })).toHaveAttribute("aria-checked", "true");
    await expect(menu).toHaveAttribute("data-state", "open");

    await userEvent.click(page.getByRole("menuitemradio", { name: "Dark" }));
    await expect(page.getByRole("menuitemradio", { name: "Dark" })).toHaveAttribute("aria-checked", "true");
    await expect(menu).toHaveAttribute("data-state", "open");

    // An open modal menu sets pointer-events: none on <body>, so a real click
    // outside lands on <html>. Clicking <body> here would be refused.
    await userEvent.click(document.documentElement);
    await closed();

    await userEvent.click(trigger);
    await userEvent.click(await page.findByRole("menuitem", { name: "Reset view" }));
    await closed();

    await userEvent.click(trigger);
    await page.findByRole("menu");
    await userEvent.keyboard("{Escape}");
    await closed();
  },
};
