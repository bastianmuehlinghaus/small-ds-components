import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import {
  ChevronRightIcon,
  ComposeIcon,
  HomeIcon,
  InboxIcon,
  SearchIcon,
  SettingsIcon,
} from "../Icon";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarHeaderAction,
  SidebarHeaderItem,
  SidebarItem,
  SidebarSection,
} from "./Sidebar";

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A page to put the sidebar in: the sidebar on the page background, the
 *  content beside it on background/raised, so the sidebar recedes. */
function Page({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        height: "36rem",
        background: "var(--sds-color-background-default)",
      }}
    >
      {children}
      <main
        style={{
          flex: 1,
          margin: "var(--sds-space-inset-sm)",
          marginInlineStart: 0,
          borderRadius: "var(--sds-radius-surface)",
          background: "var(--sds-color-background-raised)",
        }}
      />
    </div>
  );
}

const Logo = () => (
  // A placeholder mark: a filled square at icon size.
  <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
    <rect width="16" height="16" rx="4" />
  </svg>
);

function Header() {
  return (
    <SidebarHeader>
      <SidebarHeaderItem icon={<Logo />}>Small DS</SidebarHeaderItem>
      <SidebarHeaderAction aria-label="Search">
        <SearchIcon />
      </SidebarHeaderAction>
      <SidebarHeaderAction aria-label="New issue">
        <ComposeIcon />
      </SidebarHeaderAction>
    </SidebarHeader>
  );
}

/** Header, two sections and a footer. The current page has the selected fill
 *  and `aria-current="page"`; every icon, title and label starts on one edge. */
export const Default: Story = {
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection>
            <SidebarItem href="#home" iconBefore={<HomeIcon />}>Home</SidebarItem>
            <SidebarItem href="#inbox" iconBefore={<InboxIcon />} current>Inbox</SidebarItem>
          </SidebarSection>
          <SidebarSection title="Workspace">
            <SidebarItem href="#tokens">Tokens</SidebarItem>
            <SidebarItem href="#components">Components</SidebarItem>
            <SidebarItem href="#changelog">Changelog</SidebarItem>
          </SidebarSection>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSection>
            <SidebarItem href="#settings" iconBefore={<SettingsIcon />}>Settings</SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    </Page>
  ),
};

/** An icon before the label, after it, both or neither. The icon after sits at
 *  the end of the row, level with the header actions' icons. */
export const IconsBeforeAndAfter: Story = {
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection title="Icons">
            <SidebarItem href="#none">Label</SidebarItem>
            <SidebarItem href="#before" iconBefore={<InboxIcon />}>Label</SidebarItem>
            <SidebarItem href="#after" iconAfter={<ChevronRightIcon />}>Label</SidebarItem>
            <SidebarItem href="#both" iconBefore={<InboxIcon />} iconAfter={<ChevronRightIcon />}>
              Label
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  ),
};

/** A collapsible section's title is a disclosure button; its chevron points
 *  down when open and at the title's end when closed. */
export const CollapsibleSections: Story = {
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection title="Workspace" collapsible>
            <SidebarItem href="#tokens">Tokens</SidebarItem>
            <SidebarItem href="#components">Components</SidebarItem>
          </SidebarSection>
          <SidebarSection title="Archive" collapsible defaultOpen={false}>
            <SidebarItem href="#2025">2025</SidebarItem>
            <SidebarItem href="#2024">2024</SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  ),
};

/** One level of nesting. A nested item starts at its parent's label, with or
 *  without an icon of its own. */
export const NestedItems: Story = {
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection title="Your teams" collapsible>
            <SidebarItem
              href="#design"
              iconBefore={<HomeIcon />}
              nestedItems={
                <>
                  <SidebarItem href="#design-issues" current>Issues</SidebarItem>
                  <SidebarItem href="#design-projects">Projects</SidebarItem>
                </>
              }
            >
              Design
            </SidebarItem>
            <SidebarItem
              href="#engineering"
              iconBefore={<HomeIcon />}
              nestedItems={
                <>
                  <SidebarItem href="#eng-inbox" iconBefore={<InboxIcon />}>Triage</SidebarItem>
                  <SidebarItem href="#eng-settings" iconBefore={<SettingsIcon />}>Settings</SidebarItem>
                </>
              }
            >
              Engineering
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  ),
};

/** A label longer than the sidebar ends in an ellipsis, and the icon after it
 *  stays at the end. */
export const LongLabelTruncates: Story = {
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection title="A section title that is far too long for the sidebar">
            <SidebarItem href="#long" iconBefore={<InboxIcon />} iconAfter={<ChevronRightIcon />}>
              An item label that is far too long for the sidebar
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const label = within(canvasElement).getByText(/An item label/);
    await expect(label.scrollWidth).toBeGreaterThan(label.clientWidth);
    const row = label.closest("a")!;
    const after = row.lastElementChild!;
    await expect(after.getBoundingClientRect().right).toBeLessThanOrEqual(row.getBoundingClientRect().right);
  },
};

/* --- behaviour tests ------------------------------------------------------ */

/** Holds the alignment the component is built around: icons and section title
 *  text on one start edge, 16 from the sidebar's; a nested item's content on
 *  its parent's label; trailing icons level with the header actions' icons. */
export const RowsShareOneEdge: Story = {
  tags: ["test", "!autodocs"],
  render: () => (
    <Page>
      <Sidebar aria-label="Main">
        <Header />
        <SidebarContent>
          <SidebarSection title="Section">
            <SidebarItem
              href="#parent"
              iconBefore={<HomeIcon />}
              iconAfter={<ChevronRightIcon />}
              nestedItems={<SidebarItem href="#child" iconBefore={<InboxIcon />}>Child</SidebarItem>}
            >
              Parent
            </SidebarItem>
          </SidebarSection>
        </SidebarContent>
      </Sidebar>
    </Page>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const nav = canvas.getByRole("navigation", { name: "Main" });
    const left = (el: Element) => el.getBoundingClientRect().left - nav.getBoundingClientRect().left;
    const right = (el: Element) => nav.getBoundingClientRect().right - el.getBoundingClientRect().right;
    const iconOf = (el: Element) => el.querySelector("svg")!;

    const headerItem = canvas.getByRole("button", { name: /Small DS/ });
    const parent = canvas.getByRole("link", { name: /Parent/ });
    const child = canvas.getByRole("link", { name: /Child/ });
    const title = canvas.getByText("Section");
    const search = canvas.getByRole("button", { name: "Search" });
    const compose = canvas.getByRole("button", { name: "New issue" });

    await expect(left(iconOf(headerItem))).toBe(16);
    await expect(left(iconOf(parent))).toBe(16);
    await expect(left(title)).toBe(16);
    await expect(left(iconOf(child))).toBe(left(parent.querySelector("span:nth-child(2)")!));
    await expect(right(iconOf(compose))).toBe(16);
    await expect(right(parent.lastElementChild!)).toBe(16);
    await expect(search.getBoundingClientRect().height).toBe(32);
    await expect(parent.getBoundingClientRect().height).toBe(32);
  },
};

/** The current item is announced as the current page, and only that one. */
export const CurrentPage: Story = {
  tags: ["test", "!autodocs"],
  render: Default.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Inbox" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
  },
};

/** A collapsible title is a button with aria-expanded that hides and shows its
 *  list, from the pointer and from the keyboard. */
export const CollapsibleToggles: Story = {
  tags: ["test", "!autodocs"],
  render: CollapsibleSections.render,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const workspace = canvas.getByRole("button", { name: "Workspace" });
    const archive = canvas.getByRole("button", { name: "Archive" });

    await expect(workspace).toHaveAttribute("aria-expanded", "true");
    await expect(archive).toHaveAttribute("aria-expanded", "false");
    await expect(canvas.queryByRole("link", { name: "2025" })).toBeNull();

    await userEvent.click(workspace);
    await expect(workspace).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(canvas.queryByRole("link", { name: "Tokens" })).toBeNull());

    archive.focus();
    await userEvent.keyboard("{Enter}");
    await expect(archive).toHaveAttribute("aria-expanded", "true");
    await expect(canvas.getByRole("link", { name: "2025" })).toBeVisible();
  },
};
