import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { SectionMessage, SectionMessageAction } from "./SectionMessage";

const meta = {
  title: "Components/SectionMessage",
  component: SectionMessage,
  parameters: { layout: "padded" },
  args: {
    title: "Tokens are out of date",
    children: "Two variables changed in Figma since the last build. Rebuild the tokens package to pick them up.",
  },
} satisfies Meta<typeof SectionMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The four appearances. Colour is never the only signal: each has its own
 *  icon, and the icon is named. */
export const Appearances: Story = {
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <SectionMessage {...args} appearance="info" title="Info">
        A new version of the token library is available.
      </SectionMessage>
      <SectionMessage {...args} appearance="success" title="Success">
        The tokens package was rebuilt.
      </SectionMessage>
      <SectionMessage {...args} appearance="warning" title="Warning">
        This token will be removed in the next release.
      </SectionMessage>
      <SectionMessage {...args} appearance="error" title="Error">
        The build failed: a Tier 2 alias points at a missing primitive.
      </SectionMessage>
    </div>
  ),
};

/** Without a title, the icon centres on the message's first line instead. */
export const WithoutTitle: Story = {
  args: { title: undefined },
};

/** Actions sit under the message, as links. Several are a list, separated by
 *  dots. A `SectionMessageAction` with `href` is a link; without, a button. */
export const WithActions: Story = {
  args: {
    appearance: "warning",
    actions: (
      <>
        <SectionMessageAction onClick={fn()}>Rebuild tokens</SectionMessageAction>
        <SectionMessageAction href="#changelog">View changes</SectionMessageAction>
      </>
    ),
  },
};

/** `onDismiss` adds a compact dismiss button at the end, level with the
 *  icon. The message doesn't hide itself: remove it in `onDismiss`. */
export const Dismissible: Story = {
  args: { appearance: "success", title: "Tokens rebuilt", children: "The package picked up two changed variables.", onDismiss: fn() },
};

/** Paragraphs stack with the same gap as the title, and the message wraps
 *  inside whatever width it is given. */
export const LongContent: Story = {
  args: {
    appearance: "error",
    title: "Two aliases are broken in Dark",
    children: (
      <>
        <p>
          color/background/utility-warning and color/border/utility-warning point at primitives that no longer exist,
          so they resolve to their Light values in Dark.
        </p>
        <p>Re-aim them in Figma, then extract and rebuild.</p>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: "24rem" }}><Story /></div>],
};

/** The 24px glyph is centred on the first line, whichever comes first: the
 *  title (28), or the message (20), which is then padded by 2 so the glyph
 *  doesn't overhang the box. */
export const IconCentredOnFirstLine: Story = {
  tags: ["!autodocs", "test"],
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <SectionMessage {...args} data-testid="with-title" />
      <SectionMessage {...args} title={undefined} data-testid="without-title">
        The tokens package was rebuilt.
      </SectionMessage>
    </div>
  ),
  play: async ({ canvas }) => {
    const centre = (r: DOMRect) => r.top + r.height / 2;
    const without = canvas.getByTestId("without-title");
    // one line of message beside a 24 glyph: 16 + 24 + 16
    await expect(without.offsetHeight).toBe(56);
    for (const id of ["with-title", "without-title"]) {
      const message = canvas.getByTestId(id);
      const glyph = message.querySelector("svg") as SVGElement;
      // the first block of text: the title, or the message when there is none
      const text = message.lastElementChild!.firstElementChild as HTMLElement;
      const style = getComputedStyle(text);
      const firstLine =
        text.getBoundingClientRect().top + parseFloat(style.paddingTop) + parseFloat(style.lineHeight) / 2;
      await expect(centre(glyph.getBoundingClientRect())).toBeCloseTo(firstLine, 1);
    }
  },
};

/** The icon is announced, so the appearance doesn't rest on colour; one
 *  action is not a list, several are, and the dots between them are not read. */
export const Semantics: Story = {
  tags: ["!autodocs", "test"],
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <SectionMessage
        {...args}
        appearance="error"
        data-testid="one"
        actions={<SectionMessageAction onClick={fn()}>Retry</SectionMessageAction>}
      />
      <SectionMessage
        {...args}
        appearance="warning"
        iconLabel="Achtung"
        data-testid="two"
        actions={
          <>
            <SectionMessageAction onClick={fn()}>Rebuild tokens</SectionMessageAction>
            <SectionMessageAction href="#changelog">View changes</SectionMessageAction>
          </>
        }
      />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("img", { name: "Error" })).toBeVisible();
    await expect(canvas.getByRole("img", { name: "Achtung" })).toBeVisible();
    await expect(canvas.getAllByRole("heading", { level: 2 })).toHaveLength(2);

    const one = canvas.getByTestId("one");
    await expect(one.querySelector("ul")).toBeNull();
    await expect(canvas.getByRole("button", { name: "Retry" })).toBeVisible();

    const list = canvas.getByRole("list");
    await expect(list.querySelectorAll("li")).toHaveLength(2);
    await expect(canvas.getByRole("link", { name: "View changes" })).toHaveAttribute("href", "#changelog");
    // the separator is drawn, but has no text alternative
    const second = list.querySelectorAll("li")[1]!;
    await expect(getComputedStyle(second, "::before").content).toContain("·");
    await expect(second).toHaveTextContent(/^View changes$/);
  },
};

/** The dismiss button is named for its message, a 24 target, and level with
 *  the icon with or without a title. */
export const DismissButton: Story = {
  tags: ["!autodocs", "test"],
  args: { onDismiss: fn() },
  render: (args) => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <SectionMessage {...args} data-testid="with-title" />
      <SectionMessage {...args} title={undefined} data-testid="without-title" />
    </div>
  ),
  play: async ({ canvas, args, userEvent }) => {
    const named = canvas.getByRole("button", { name: "Dismiss Tokens are out of date" });
    await expect([named.offsetWidth, named.offsetHeight]).toEqual([24, 24]);
    await userEvent.click(named);
    await expect(args.onDismiss).toHaveBeenCalledTimes(1);
    // without a title the name is the prefix alone
    await expect(canvas.getByRole("button", { name: "Dismiss" })).toBeVisible();

    for (const id of ["with-title", "without-title"]) {
      const message = canvas.getByTestId(id);
      const glyph = message.querySelector("[role=img]")!.getBoundingClientRect();
      const button = message.querySelector("button")!.getBoundingClientRect();
      await expect(button.top).toBeCloseTo(glyph.top, 1);
      await expect(button.right).toBeCloseTo(message.getBoundingClientRect().right - 16, 1);
    }
  },
};

/** In a wide container the text stops at the measure, about 77 characters a
 *  line, while the tint and the dismiss button still span the full width. */
export const TextMeasure: Story = {
  tags: ["!autodocs", "test"],
  args: {
    onDismiss: fn(),
    children:
      "Two variables changed in Figma since the last build. Rebuild the tokens package to pick them up, then accept the library update in the Components file so the new values show there too.",
  },
  decorators: [(Story) => <div style={{ width: "60rem" }}><Story /></div>],
  play: async ({ canvasElement, canvas }) => {
    const message = canvasElement.querySelector("section")!;
    const measure = parseFloat(getComputedStyle(message).getPropertyValue("--sds-size-text-max-width"));
    const content = message.children[1] as HTMLElement;
    for (const block of Array.from(content.children) as HTMLElement[]) {
      await expect(block.offsetWidth).toBeLessThanOrEqual(measure);
    }
    // the message itself still fills its container, the button stays at the end
    await expect(message.offsetWidth).toBe(960);
    const button = canvas.getByRole("button").getBoundingClientRect();
    await expect(button.right).toBeCloseTo(message.getBoundingClientRect().right - 16, 1);
  },
};
