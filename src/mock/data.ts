// ─── Block types (shared between TemplateEditor & CampaignCreate) ───────────

export type BlockType = "header" | "text" | "image" | "button" | "divider" | "footer" | "social";

export interface SocialPlatform {
  id: string;
  name: string;
  url: string;
  enabled: boolean;
  color: string;
}

export interface Block {
  id: string;
  type: BlockType;
  // common
  align?: "left" | "center" | "right";
  // header / text / footer
  content?: string;
  subContent?: string;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  // image
  imageUrl?: string;
  imageAlt?: string;
  // button
  buttonText?: string;
  buttonLink?: string;
  buttonColor?: string;
  buttonStyle?: "solid" | "outlined" | "text";
  cornerRadius?: "4" | "8" | "24" | "pill";
  buttonWidth?: "auto" | "full";
  // divider
  lineStyle?: "solid" | "dashed" | "dotted";
  thickness?: "1" | "2";
  lineColor?: string;
  spacing?: number;
  // social
  socialPlatforms?: SocialPlatform[];
  socialAlignment?: "left" | "center" | "right";
  iconSize?: "24" | "32" | "40";
  iconStyle?: "colored" | "monochrome" | "outline";
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

export const DEFAULT_SOCIAL_PLATFORMS: SocialPlatform[] = [
  { id: "x",        name: "X",        url: "https://x.com/infstones",               enabled: true,  color: "#000000" },
  { id: "linkedin", name: "LinkedIn", url: "https://linkedin.com/company/infstones", enabled: true,  color: "#0A66C2" },
  { id: "facebook", name: "Facebook", url: "https://facebook.com/infstones",         enabled: true,  color: "#1877F2" },
  { id: "youtube",  name: "YouTube",  url: "https://youtube.com/@infstones",         enabled: true,  color: "#FF0000" },
  { id: "github",   name: "GitHub",   url: "https://github.com/infstones",           enabled: true,  color: "#24292e" },
  { id: "telegram", name: "Telegram", url: "https://t.me/infstones",                 enabled: false, color: "#26A5E4" },
  { id: "discord",  name: "Discord",  url: "https://discord.gg/infstones",           enabled: false, color: "#5865F2" },
];

export function defaultBlock(type: BlockType): Omit<Block, "id"> {
  switch (type) {
    case "header":
      return { type, content: "Your Header Here", bgColor: "#6366f1", textColor: "#ffffff", align: "center", fontSize: 20 };
    case "text":
      return { type, content: "Add your text content here. You can edit this directly.", align: "left", fontSize: 14, textColor: "#374151" };
    case "image":
      return { type, imageUrl: "", imageAlt: "Image", align: "center" };
    case "button":
      return { type, buttonText: "Click Here", buttonLink: "https://", buttonColor: "#6366f1", align: "center", buttonStyle: "solid", cornerRadius: "8", buttonWidth: "auto" };
    case "divider":
      return { type, lineStyle: "solid", thickness: "1", lineColor: "#e5e7eb", spacing: 16 };
    case "footer":
      return { type, content: "InfStones Inc. | 123 Blockchain Ave", subContent: "Unsubscribe | Manage Preferences", align: "center", textColor: "#9ca3af", fontSize: 12 };
    case "social":
      return { type, socialPlatforms: DEFAULT_SOCIAL_PLATFORMS.map(p => ({ ...p })), socialAlignment: "center", iconSize: "24", iconStyle: "colored" };
  }
}

export function getBlankBlocks(): Block[] {
  return [
    { id: uid(), ...defaultBlock("header") },
    { id: uid(), ...defaultBlock("text") },
    { id: uid(), ...defaultBlock("button") },
    { id: uid(), ...defaultBlock("social") },
    { id: uid(), ...defaultBlock("footer") },
  ];
}

const TEMPLATE_BLOCK_DEFS: Record<string, Omit<Block, "id">[]> = {
  t1: [
    { ...defaultBlock("header"), content: "Simple Newsletter", bgColor: "#6366f1" },
    { ...defaultBlock("text"), content: "Welcome to another edition of the InfStones Insider Newsletter. Stay updated with the latest developments in Web3 infrastructure, staking insights, and community highlights." },
    { ...defaultBlock("divider") },
    { ...defaultBlock("text"), content: "• Q1 2026 infrastructure growth recap\n• New DePIN node deployments across 12 networks\n• Upcoming community AMA — register now\n• Partner spotlight & Q2 roadmap preview" },
    { ...defaultBlock("button"), buttonText: "Read the Full Issue →", buttonLink: "https://infstones.com/blog", cornerRadius: "8" },
    { ...defaultBlock("social") },
    { ...defaultBlock("footer") },
  ],
  t2: [
    { ...defaultBlock("header"), content: "Product Announcement", bgColor: "#0ea5e9" },
    { ...defaultBlock("text"), content: "We're excited to announce our latest product update. Our network now supports over 80 blockchains with 99.9% uptime SLA.", fontSize: 15 },
    { ...defaultBlock("image") },
    { ...defaultBlock("text"), content: "New integrations include Monad, Berachain, and Story Protocol." },
    { ...defaultBlock("button"), buttonText: "Learn More", buttonLink: "https://infstones.com", buttonColor: "#0ea5e9" },
    { ...defaultBlock("social") },
    { ...defaultBlock("footer") },
  ],
  t3: [
    { ...defaultBlock("header"), content: "Welcome to InfStones!", bgColor: "#10b981" },
    { ...defaultBlock("text"), content: "Thank you for joining us. We're thrilled to have you as part of the InfStones community.", fontSize: 15 },
    { ...defaultBlock("button"), buttonText: "Get Started", buttonLink: "https://infstones.com", buttonColor: "#10b981" },
    { ...defaultBlock("divider") },
    { ...defaultBlock("text"), content: "If you have any questions, our support team is here to help 24/7.", fontSize: 13 },
    { ...defaultBlock("social") },
    { ...defaultBlock("footer") },
  ],
  t4: [
    { ...defaultBlock("header"), content: "You're Invited!", bgColor: "#f59e0b", textColor: "#ffffff" },
    { ...defaultBlock("text"), content: "Join us for an exclusive event. Space is limited — reserve your spot today.", fontSize: 15 },
    { ...defaultBlock("image") },
    { ...defaultBlock("button"), buttonText: "Register Now", buttonLink: "https://infstones.com/events", buttonColor: "#f59e0b", cornerRadius: "24" },
    { ...defaultBlock("social") },
    { ...defaultBlock("footer") },
  ],
};

export function getTemplateDefaultBlocks(templateId: string): Block[] {
  const defs = TEMPLATE_BLOCK_DEFS[templateId];
  if (!defs) return getBlankBlocks();
  return defs.map(b => ({ id: uid(), ...b }));
}

export function loadTemplateBlocks(templateId: string): Block[] {
  if (!templateId) return getBlankBlocks();
  try {
    const stored = localStorage.getItem(`ems_template_${templateId}`);
    if (stored) return JSON.parse(stored) as Block[];
  } catch {}
  return getTemplateDefaultBlocks(templateId);
}

export function saveTemplateBlocks(templateId: string, blocks: Block[]): void {
  localStorage.setItem(`ems_template_${templateId}`, JSON.stringify(blocks));
}

// ─── Campaign sparklines (per-campaign mock data) ────────────────────────────

export const campaignSparklines: Record<string, number[]> = {
  c1: [3, 5, 4, 7, 6, 5, 8],
  c2: [2, 4, 6, 5, 7, 6, 8],
  c3: [5, 7, 6, 9, 8, 10, 9],
  c4: [1, 2, 1, 3, 2, 4, 3],
  c5: [1, 1, 2, 1, 2, 2, 3],
};

// ─── Existing mock data ───────────────────────────────────────────────────────

export const mockSubscribers = [
  { id: "s1", name: "Alice Chen",    email: "alice@acme.com",       groups: ["Newsletter", "Product Updates"], status: "active" as const,       subscribedAt: "2024-01-15" },
  { id: "s2", name: "Bob Smith",     email: "bob@techcorp.io",      groups: ["Newsletter"],                    status: "active" as const,       subscribedAt: "2024-02-01" },
  { id: "s3", name: "Carol Wu",      email: "carol@startup.co",     groups: ["Product Updates", "Beta Testers"], status: "active" as const,     subscribedAt: "2024-02-14" },
  { id: "s4", name: "David Park",    email: "david@enterprise.com", groups: ["Newsletter"],                    status: "unsubscribed" as const, subscribedAt: "2024-01-20" },
  { id: "s5", name: "Eva Martinez",  email: "eva@agency.net",       groups: ["Beta Testers"],                  status: "active" as const,       subscribedAt: "2024-03-05" },
  { id: "s6", name: "Frank Liu",     email: "frank@devco.io",       groups: ["Newsletter", "Beta Testers"],    status: "active" as const,       subscribedAt: "2024-03-12" },
  { id: "s7", name: "Grace Kim",     email: "grace@media.com",      groups: ["Product Updates"],               status: "active" as const,       subscribedAt: "2024-03-20" },
  { id: "s8", name: "Henry Zhang",   email: "henry@corp.cn",        groups: ["Newsletter"],                    status: "active" as const,       subscribedAt: "2024-04-01" },
];

export const mockGroups = [
  { id: "g1", name: "Newsletter",       description: "Main newsletter subscribers",        count: 5, lastCampaign: "Q1 Product Update" },
  { id: "g2", name: "Product Updates",  description: "Users interested in product news",   count: 4, lastCampaign: "New Feature: Analytics Dashboard" },
  { id: "g3", name: "Beta Testers",     description: "Early access program members",       count: 3, lastCampaign: "Beta v2.3 Release Notes" },
];

export const mockCampaigns = [
  { id: "c1", name: "Q1 Product Update",               subject: "See what's new in Q1 2024",                  status: "sent" as const,      groups: ["Newsletter"],                    recipients: 5, opens: 4, uniqueOpens: 3, clicks: 2, uniqueClicks: 1, bounces: 0, unsubscribes: 0, sentAt: "2024-03-15T10:00:00Z", templateId: "t1" },
  { id: "c2", name: "New Feature: Analytics Dashboard", subject: "Track everything with our new dashboard",    status: "sent" as const,      groups: ["Product Updates"],               recipients: 4, opens: 3, uniqueOpens: 3, clicks: 2, uniqueClicks: 2, bounces: 0, unsubscribes: 0, sentAt: "2024-03-22T14:00:00Z", templateId: "t2" },
  { id: "c3", name: "Beta v2.3 Release Notes",          subject: "Beta v2.3 is here - here's what changed",   status: "sent" as const,      groups: ["Beta Testers"],                  recipients: 3, opens: 3, uniqueOpens: 3, clicks: 3, uniqueClicks: 3, bounces: 0, unsubscribes: 0, sentAt: "2024-04-01T09:00:00Z", templateId: "t1" },
  { id: "c4", name: "April Newsletter",                 subject: "April updates and community highlights",     status: "scheduled" as const, groups: ["Newsletter"],                    recipients: 5, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: "2024-04-15T10:00:00Z", templateId: "t2" },
  { id: "c5", name: "Summer Preview",                   subject: "A sneak peek at what's coming this summer", status: "draft" as const,     groups: ["Newsletter", "Product Updates"], recipients: 0, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: null, templateId: null },
];

export const mockTemplates = [
  { id: "t1", name: "Simple Newsletter",     lastModified: "2024-03-10", color: "#6366f1" },
  { id: "t2", name: "Product Announcement",  lastModified: "2024-03-18", color: "#0ea5e9" },
  { id: "t3", name: "Welcome Email",         lastModified: "2024-02-28", color: "#10b981" },
  { id: "t4", name: "Event Invitation",      lastModified: "2024-04-02", color: "#f59e0b" },
];

export const mockRecipientActivity = [
  { name: "Alice Chen",   email: "alice@acme.com",       opened: true,  clicked: true  },
  { name: "Bob Smith",    email: "bob@techcorp.io",      opened: true,  clicked: false },
  { name: "Carol Wu",     email: "carol@startup.co",     opened: true,  clicked: true  },
  { name: "David Park",   email: "david@enterprise.com", opened: false, clicked: false },
  { name: "Eva Martinez", email: "eva@agency.net",        opened: true,  clicked: false },
];
