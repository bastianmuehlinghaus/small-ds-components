import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn } from "storybook/test";
import { Button } from "../Button";
import { Header, HeaderBack } from "./Header";

const meta = {
  title: "Components/Header",
  component: Header,
  parameters: { layout: "padded" },
  args: { level: "page", title: "Projects" },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

/** The three levels: page, section and sub-section. */
export const Levels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--sds-space-section-sm)" }}>
      <Header level="page" title="Projects" subtitle="Everything your team is working on." />
      <Header level="section" title="Active" subtitle="Projects with work in progress." />
      <Header level="subsection" title="Design system" />
    </div>
  ),
};

/** A page header with everything: a back button, a subtitle and actions. */
export const PageWithBackAndActions: Story = {
  args: {
    title: "Small DS",
    subtitle: "A small, strict design system.",
    back: <HeaderBack href="#projects" />,
    actions: (
      <>
        <Button onClick={fn()}>Export</Button>
        <Button variant="primary" onClick={fn()}>
          New issue
        </Button>
      </>
    ),
  },
};

/** When the title and the actions don't fit side by side, the actions wrap
 *  below, and a long title wraps on its own lines. */
export const LongTitleWraps: Story = {
  args: {
    title: "Tokens, components and the documentation that holds them together",
    subtitle: "A small, strict design system.",
    back: <HeaderBack href="#projects" />,
    actions: (
      <>
        <Button onClick={fn()}>Export</Button>
        <Button variant="primary" onClick={fn()}>
          New issue
        </Button>
      </>
    ),
  },
  decorators: [(Story) => <div style={{ maxWidth: "32rem" }}><Story /></div>],
};

/** The back button and the actions are 32, centred on the title's 40 line,
 *  and the title text starts 8 after the back button. */
export const CentredOnTheTitle: Story = {
  tags: ["!autodocs", "test"],
  args: PageWithBackAndActions.args,
  render: (args) => <Header {...args} data-testid="header" />,
  play: async ({ canvas }) => {
    const heading = canvas.getByRole("heading", { level: 1 });
    const line = heading.getBoundingClientRect();
    await expect(line.height).toBe(40);
    const back = canvas.getByRole("link", { name: "Back" }).getBoundingClientRect();
    const action = canvas.getByRole("button", { name: "New issue" }).getBoundingClientRect();
    await expect([back.width, back.height]).toEqual([32, 32]);
    for (const box of [back, action]) {
      await expect(box.top + box.height / 2).toBeCloseTo(line.top + line.height / 2, 1);
    }
    await expect(line.left - back.right).toBe(8);
    // the actions end at the header's end
    const header = canvas.getByTestId("header").getBoundingClientRect();
    await expect(action.right).toBeCloseTo(header.right, 1);
  },
};

/** Each level is its heading element by default, `headingLevel` changes the
 *  element and not the look, and the back button is an `<a>` with `href`, a
 *  `<button>` without, named "Back" unless translated. */
export const Semantics: Story = {
  tags: ["!autodocs", "test"],
  render: () => (
    <div style={{ display: "grid", gap: "var(--sds-space-stack-md)" }}>
      <Header level="page" title="Page" back={<HeaderBack onClick={fn()} label="Zurück" />} />
      <Header level="section" title="Section" />
      <Header level="subsection" title="Sub-section" />
      <Header level="section" title="Nested section" headingLevel="h3" data-testid="nested" />
    </div>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Page");
    await expect(canvas.getByRole("heading", { level: 2 })).toHaveTextContent("Section");
    const h3s = canvas.getAllByRole("heading", { level: 3 });
    await expect(h3s.map((h) => h.textContent)).toEqual(["Sub-section", "Nested section"]);
    // an h3 at section level still looks like a section
    const section = canvas.getByRole("heading", { level: 2 });
    await expect(getComputedStyle(h3s[1]!).fontSize).toBe(getComputedStyle(section).fontSize);
    await expect(canvas.getByRole("button", { name: "Zurück" })).toHaveAttribute("type", "button");
    // not a <header>, so never the page's banner landmark
    await expect(canvas.queryByRole("banner")).toBeNull();
  },
};

/** Actions that don't fit beside the title wrap below it, to the start. */
export const WrappedActionsStart: Story = {
  tags: ["!autodocs", "test"],
  args: LongTitleWraps.args,
  decorators: LongTitleWraps.decorators,
  render: (args) => <Header {...args} data-testid="header" />,
  play: async ({ canvas }) => {
    const header = canvas.getByTestId("header").getBoundingClientRect();
    const title = canvas.getByRole("heading", { level: 1 }).getBoundingClientRect();
    const first = canvas.getByRole("button", { name: "Export" }).getBoundingClientRect();
    await expect(first.top).toBeGreaterThan(title.bottom);
    await expect(first.left).toBeCloseTo(header.left, 1);
  },
};
