export type SubscriberStatus = "active" | "unsubscribed";
export type CampaignStatus = "sent" | "scheduled" | "draft" | "sending";
export type UserRole = "admin" | "member";

export interface Subscriber {
  id: string;
  name: string;
  email: string;
  org?: string;
  groups: string[];
  status: SubscriberStatus;
  subscribedAt: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  count: number;
  lastCampaign: string;
}

export interface Campaign {
  id: string;
  name: string;
  subject: string;
  status: CampaignStatus;
  groups: string[];
  recipients: number;
  opens: number;
  uniqueOpens: number;
  clicks: number;
  uniqueClicks: number;
  bounces: number;
  unsubscribes: number;
  sentAt: string | null;
  templateId: string | null;
}

export interface Template {
  id: string;
  name: string;
  lastModified: string;
  color: string;
}

export interface TrendPoint {
  date: string;
  sent: number;
  openRate: number;
  clickRate: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export const mockSubscribers: Subscriber[] = [
  { id: "s1", name: "Alice Chen", email: "alice@acme.com", org: "Acme Labs", groups: ["Newsletter", "Product Updates"], status: "active", subscribedAt: "2024-01-15" },
  { id: "s2", name: "Bob Smith", email: "bob@techcorp.io", org: "Techcorp", groups: ["Newsletter"], status: "active", subscribedAt: "2024-02-01" },
  { id: "s3", name: "Carol Wu", email: "carol@startup.co", org: "Startup Co", groups: ["Product Updates", "Beta Testers"], status: "active", subscribedAt: "2024-02-14" },
  { id: "s4", name: "David Park", email: "david@enterprise.com", org: "Enterprise Inc", groups: ["Newsletter"], status: "unsubscribed", subscribedAt: "2024-01-20" },
  { id: "s5", name: "Eva Martinez", email: "eva@agency.net", org: "Agency Net", groups: ["Beta Testers"], status: "active", subscribedAt: "2024-03-05" },
  { id: "s6", name: "Frank Liu", email: "frank@devco.io", org: "Devco", groups: ["Newsletter", "Beta Testers"], status: "active", subscribedAt: "2024-03-12" },
  { id: "s7", name: "Grace Kim", email: "grace@media.com", org: "Media Co", groups: ["Product Updates"], status: "active", subscribedAt: "2024-03-20" },
  { id: "s8", name: "Henry Zhang", email: "henry@corp.cn", org: "Corp CN", groups: ["Newsletter"], status: "active", subscribedAt: "2024-04-01" },
  { id: "s9", name: "Isabel Rossi", email: "isabel@depin.xyz", org: "DePIN Labs", groups: ["Beta Testers"], status: "active", subscribedAt: "2024-04-06" },
  { id: "s10", name: "Jonas Becker", email: "jonas@validator.eu", org: "Validator EU", groups: ["Newsletter", "Product Updates"], status: "active", subscribedAt: "2024-04-09" },
];

export const mockGroups: Group[] = [
  { id: "g1", name: "Newsletter", description: "Main newsletter subscribers — goes out weekly.", count: 6, lastCampaign: "Q1 Product Update" },
  { id: "g2", name: "Product Updates", description: "Users interested in product news and feature launches.", count: 4, lastCampaign: "New Feature: Analytics Dashboard" },
  { id: "g3", name: "Beta Testers", description: "Early access program members — first to try new releases.", count: 4, lastCampaign: "Beta v2.3 Release Notes" },
];

export const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Q1 Product Update", subject: "See what's new in Q1 2026", status: "sent", groups: ["Newsletter"], recipients: 8420, opens: 4640, uniqueOpens: 4211, clicks: 1423, uniqueClicks: 1088, bounces: 54, unsubscribes: 12, sentAt: "2026-03-15T10:00:00Z", templateId: "t1" },
  { id: "c2", name: "New Feature: Analytics Dashboard", subject: "Track everything with our new dashboard", status: "sent", groups: ["Product Updates"], recipients: 4120, opens: 2640, uniqueOpens: 2212, clicks: 1040, uniqueClicks: 892, bounces: 28, unsubscribes: 6, sentAt: "2026-03-22T14:00:00Z", templateId: "t2" },
  { id: "c3", name: "Beta v2.3 Release Notes", subject: "Beta v2.3 is here — here's what changed", status: "sent", groups: ["Beta Testers"], recipients: 612, opens: 455, uniqueOpens: 420, clicks: 298, uniqueClicks: 275, bounces: 4, unsubscribes: 1, sentAt: "2026-04-01T09:00:00Z", templateId: "t1" },
  { id: "c4", name: "April Newsletter", subject: "April updates and community highlights", status: "scheduled", groups: ["Newsletter"], recipients: 8510, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: "2026-04-28T10:00:00Z", templateId: "t2" },
  { id: "c5", name: "Summer Preview", subject: "A sneak peek at what's coming this summer", status: "draft", groups: ["Newsletter", "Product Updates"], recipients: 0, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: null, templateId: null },
  { id: "c6", name: "Staking Infrastructure Recap", subject: "80+ blockchains, 99.9% uptime — our Q1 recap", status: "sent", groups: ["Newsletter", "Product Updates"], recipients: 9240, opens: 5420, uniqueOpens: 4930, clicks: 1890, uniqueClicks: 1510, bounces: 62, unsubscribes: 18, sentAt: "2026-02-28T10:00:00Z", templateId: "t1" },
  { id: "c7", name: "AMA Invite — Monad & Berachain", subject: "You're invited: live AMA this Thursday", status: "sent", groups: ["Beta Testers"], recipients: 610, opens: 498, uniqueOpens: 462, clicks: 331, uniqueClicks: 301, bounces: 3, unsubscribes: 0, sentAt: "2026-04-10T16:00:00Z", templateId: "t4" },
  { id: "c8", name: "Onboarding Email #1", subject: "Welcome to InfStones — get started in 5 minutes", status: "draft", groups: [], recipients: 0, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: null, templateId: "t3" },
];

export const mockTemplates: Template[] = [
  { id: "t1", name: "Simple Newsletter", lastModified: "2026-03-10", color: "#EDB500" },
  { id: "t2", name: "Product Announcement", lastModified: "2026-03-18", color: "#0B0E1E" },
  { id: "t3", name: "Welcome Email", lastModified: "2026-02-28", color: "#0F9D58" },
  { id: "t4", name: "Event Invitation", lastModified: "2026-04-02", color: "#4F46E5" },
];

export const mockRecipientActivity = [
  { name: "Alice Chen", email: "alice@acme.com", opened: true, clicked: true },
  { name: "Bob Smith", email: "bob@techcorp.io", opened: true, clicked: false },
  { name: "Carol Wu", email: "carol@startup.co", opened: true, clicked: true },
  { name: "David Park", email: "david@enterprise.com", opened: false, clicked: false },
  { name: "Eva Martinez", email: "eva@agency.net", opened: true, clicked: false },
  { name: "Frank Liu", email: "frank@devco.io", opened: true, clicked: true },
];

export const mockTrend: TrendPoint[] = [
  { date: "2026-02-01", sent: 5400, openRate: 48, clickRate: 17 },
  { date: "2026-02-15", sent: 6100, openRate: 52, clickRate: 19 },
  { date: "2026-03-01", sent: 7200, openRate: 55, clickRate: 20 },
  { date: "2026-03-15", sent: 8400, openRate: 56, clickRate: 21 },
  { date: "2026-03-29", sent: 9200, openRate: 59, clickRate: 22 },
  { date: "2026-04-12", sent: 8800, openRate: 57, clickRate: 20 },
  { date: "2026-04-19", sent: 9300, openRate: 60, clickRate: 23 },
];

export const mockUsers: User[] = [
  { id: "u1", name: "Hongxuan Liu", email: "hongxuan.liu@infstones.com", role: "admin" },
  { id: "u2", name: "Pamela Chen", email: "pamela.chen@infstones.com", role: "admin" },
  { id: "u3", name: "Kevin Wang", email: "kevin.wang@infstones.com", role: "member" },
  { id: "u4", name: "Sarah Lin", email: "sarah.lin@infstones.com", role: "member" },
  { id: "u5", name: "Jason Yu", email: "jason.yu@infstones.com", role: "member" },
];
