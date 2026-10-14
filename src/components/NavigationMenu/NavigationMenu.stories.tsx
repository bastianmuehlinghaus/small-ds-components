import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor, within } from "storybook/test";
import { a11yRules } from "../../../.storybook/a11yRules";
import { NavigationMenu } from "./NavigationMenu";

const meta = {
  title: "Components/NavigationMenu",
  component: NavigationMenu.Root,
  parameters: {
    layout: "padded",
    a11y: {
      config: {
        rules: [
          ...a11yRules,
          /* While a panel is open, Radix puts a focus proxy right after its
             trigger: a hidden span with tabIndex 0 and aria-hidden, which axe
             reports as aria-hidden-focus. It never keeps focus. Tab from the
             trigger passes through it into the panel; Shift+Tab out of the
             panel and Tab past its last row pass through it to the trigger
             and the next item. Checked with real key presses (Playwright,
             2026-10-13). A play function cannot check it: user-event does not
             run the browser's own Tab after Radix moves focus in keydown, so
             it stops on the proxy where a browser does not. Only that span is
             exempt. */
          { id: "aria-hidden-focus", selector: '*:not([aria-expanded="true"] + span[aria-hidden="true"])' },
        ],
      },
    },
  },
} satisfies Meta<typeof NavigationMenu.Root>;

export default meta;
type Story = StoryObj<typeof meta>;

type BarProps = {
  /** Which panel is open on first render, by its Item's value. */
  defaultValue?: string;
  /** The current page, by its label. */
  current?: string;
};

/** The bar every story shares: two links and two triggers. */
function Bar({ defaultValue, current = "Tokens" }: BarProps) {
  const link = (label: string, description?: string) => (
    <NavigationMenu.Link href={`#${label.toLowerCase().replace(/ /g, "-")}`} active={label === current} description={description}>
      {label}
    </NavigationMenu.Link>
  );

  return (
    <NavigationMenu.Root aria-label="Main" defaultValue={defaultValue}>
      <NavigationMenu.List>
        <NavigationMenu.Item>{link("Tokens")}</NavigationMenu.Item>
        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {link("Button")}
            {link("Checkbox")}
            {link("Dropdown menu")}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item value="foundations">
          <NavigationMenu.Trigger>Foundations</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            {link("Colour", "Content, background, border and state")}
            {link("Typography", "Thirteen text styles in Söhne")}
            {link("Spacing", "Inline, inset, stack and section")}
          </NavigationMenu.Content>
        </NavigationMenu.Item>
        <NavigationMenu.Item>{link("Changelog")}</NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}

/** The current page carries the selected fill and aria-current="page". */
export const Default: Story = {
  render: () => <Bar />,
};

/** A panel opens under its trigger, start-aligned, on the Dropdown menu's surface. A page inside it can be the current one. */
export const OpenPanel: Story = {
  render: () => <Bar defaultValue="components" current="Dropdown menu" />,
};

/** A row's optional description sits under its label and makes the row taller. */
export const WithDescriptions: Story = {
  render: () => <Bar defaultValue="foundations" />,
};

/* --- behaviour tests ---------------------------------------------------------
   Stories with a play function that `npm test` runs. Tagged !autodocs, so
   they have no Figma example. Each closes its panel before it ends. */

/** Enter opens a panel, the arrow keys move into it, and Escape closes it and returns focus to the trigger. */
export const KeyboardOpensAndCloses: Story = {
  tags: ["!autodocs", "test"],
  render: () => <Bar />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole("button", { name: "Components" });
    await expect(trigger).toHaveAttribute("aria-expanded", "false");

    // Tab from the start: the current page's link, then the trigger.
    await userEvent.tab();
    await expect(canvas.getByRole("link", { name: "Tokens" })).toHaveFocus();
    await userEvent.tab();
    await expect(trigger).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    const first = await canvas.findByRole("link", { name: "Button" });

    await userEvent.keyboard("{ArrowDown}");
    await expect(first).toHaveFocus();
    await userEvent.keyboard("{ArrowDown}");
    await expect(canvas.getByRole("link", { name: "Checkbox" })).toHaveFocus();

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(canvas.queryByRole("link", { name: "Button" })).toBeNull());
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toHaveFocus();
  },
};

/** The current page is announced, not only filled, and only one link carries it. */
export const CurrentPageIsMarked: Story = {
  tags: ["!autodocs", "test"],
  render: () => <Bar defaultValue="components" current="Checkbox" />,
  play: async ({ canvas }) => {
    const current = await canvas.findByRole("link", { name: "Checkbox" });
    await expect(current).toHaveAttribute("aria-current", "page");
    await expect(canvas.getAllByRole("link").filter((l) => l.hasAttribute("aria-current"))).toHaveLength(1);

    // The fill is the selected state, not the hover layer.
    const fill = (el: HTMLElement) => getComputedStyle(el).backgroundColor;
    await expect(fill(current)).not.toBe(fill(canvas.getByRole("link", { name: "Button" })));
    await expect(getComputedStyle(current).backgroundImage).toBe("none");
  },
};

/** The panel's surface starts at its trigger's leading edge, one space/stack/xs below it. */
export const PanelUnderTrigger: Story = {
  tags: ["!autodocs", "test"],
  render: () => <Bar defaultValue="foundations" />,
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Foundations" });
    const first = await canvas.findByRole("link", { name: /Colour/ });
    const surface = first.closest("ul")!.parentElement!;
    const gap = parseFloat(getComputedStyle(surface).getPropertyValue("--sds-space-stack-xs"));

    // After the entry animation, so the scale doesn't move the edges.
    await waitFor(() => expect(getComputedStyle(surface.parentElement!).opacity).toBe("1"));
    const t = trigger.getBoundingClientRect();
    const s = surface.getBoundingClientRect();
    await expect(s.left).toBe(t.left);
    await expect(s.top).toBe(t.bottom + gap);
  },
};

const longLabel = "Semantic colour tokens for content, border and background, with their dark-mode values";

/** The surface grows with its widest row up to size-overlay-max-width (480). Past that a label ends in an ellipsis and a description wraps. */
export const LongLabelTruncates: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <NavigationMenu.Root aria-label="Main" defaultValue="foundations">
      <NavigationMenu.List>
        <NavigationMenu.Item value="foundations">
          <NavigationMenu.Trigger>Foundations</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#short">Spacing</NavigationMenu.Link>
            <NavigationMenu.Link href="#long">{longLabel}</NavigationMenu.Link>
            <NavigationMenu.Link href="#described" description={longLabel}>
              Colour
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
  play: async ({ canvas }) => {
    const long = await canvas.findByRole("link", { name: longLabel });
    const surface = long.closest("ul")!.parentElement!;
    const max = parseFloat(getComputedStyle(surface).getPropertyValue("--sds-size-overlay-max-width"));
    const row = parseFloat(getComputedStyle(surface).getPropertyValue("--sds-size-control-default"));

    // offsetWidth, not the bounding box: the panel scales in.
    await expect(surface.offsetWidth).toBe(max);

    const label = within(long).getByText(longLabel);
    await expect(long.offsetHeight).toBe(row);
    await expect(getComputedStyle(label).textOverflow).toBe("ellipsis");
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);

    const short = within(canvas.getByRole("link", { name: "Spacing" })).getByText("Spacing");
    await expect(short.scrollWidth).toBe(short.clientWidth);

    // The description wraps rather than truncating: more than two lines' worth.
    const described = canvas.getByRole("link", { name: /^Colour/ });
    await expect(described.offsetHeight).toBeGreaterThan(row * 2);
  },
};

/** A router's link component becomes the row with asChild, and still gets the label and description. */
export const AsChildRow: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <NavigationMenu.Root aria-label="Main" defaultValue="components">
      <NavigationMenu.List>
        <NavigationMenu.Item value="components">
          <NavigationMenu.Trigger>Components</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link asChild active description="Variants, states and the focus ring">
              <a href="#button" data-router-link="">Button</a>
            </NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  ),
  play: async ({ canvas }) => {
    const row = await canvas.findByRole("link", { name: /^Button/ });
    await expect(row).toHaveAttribute("data-router-link");
    await expect(row).toHaveAttribute("aria-current", "page");
    await expect(within(row).getByText("Button").tagName).toBe("SPAN");
    // In the document, not toBeVisible: the panel is still fading in.
    await expect(within(row).getByText("Variants, states and the focus ring")).toBeInTheDocument();
  },
};
