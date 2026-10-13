import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Link } from "./Link";

const meta = {
  title: "Components/Link",
  component: Link,
  parameters: { layout: "padded" },
  args: { href: "#changelog", children: "View changes" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <p className="sds-type-body-medium">
      Two variables changed since the last build. <Link {...args} />
    </p>
  ),
};

/** A link has no type of its own: it takes the size and weight of the text
 *  it sits in. */
export const InheritsTheText: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <p className="sds-type-heading-small">
        Tokens are out of date. <Link {...args} />
      </p>
      <p className="sds-type-body-medium">
        Tokens are out of date. <Link {...args} />
      </p>
      <p className="sds-type-body-xsmall">
        Tokens are out of date. <Link {...args} />
      </p>
    </div>
  ),
};

/** Without `href` it is a button that looks like a link: for an action in a
 *  sentence, such as Undo, where a Button would be too loud. */
export const AsButton: Story = {
  args: { href: undefined, onClick: fn(), children: "Undo" },
  render: (args) => (
    <p className="sds-type-body-medium">
      Variable deleted. <Link {...args} />
    </p>
  ),
};

/** `asChild` puts the styles on your own element, such as a router's link. */
export const AsChild: Story = {
  render: () => (
    <p className="sds-type-body-medium">
      Read{" "}
      <Link asChild>
        <a href="#rebuild">how to rebuild the tokens</a>
      </Link>{" "}
      first.
    </p>
  ),
};

/** The element follows `href`, the look does not: both are underlined in the
 *  link colour, in the font around them. */
export const Semantics: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <p className="sds-type-body-large">
      <Link href="#changelog">View changes</Link> or{" "}
      <Link onClick={fn()}>Undo</Link> or{" "}
      <Link asChild>
        <a href="#rebuild" data-testid="child">
          Rebuild
        </a>
      </Link>
    </p>
  ),
  play: async ({ canvas, canvasElement }) => {
    const anchor = canvas.getByRole("link", { name: "View changes" });
    await expect(anchor).toHaveAttribute("href", "#changelog");
    const button = canvas.getByRole("button", { name: "Undo" });
    // a button in a form must not submit it
    await expect(button).toHaveAttribute("type", "button");
    const child = canvas.getByTestId("child");
    await expect(child.className).toBe(anchor.className);

    const paragraph = getComputedStyle(canvasElement.querySelector("p")!);
    for (const element of [anchor, button, child]) {
      const style = getComputedStyle(element);
      await expect(style.textDecorationLine).toBe("underline");
      await expect(style.fontSize).toBe(paragraph.fontSize);
      await expect(style.lineHeight).toBe(paragraph.lineHeight);
      await expect(style.color).toBe(getComputedStyle(anchor).color);
    }
  },
};
