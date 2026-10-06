import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
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
