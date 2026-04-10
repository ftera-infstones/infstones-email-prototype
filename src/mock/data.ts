export const mockSubscribers = [
  { id: "s1", name: "Alice Chen", email: "alice@acme.com", groups: ["Newsletter", "Product Updates"], status: "active" as const, subscribedAt: "2024-01-15" },
  { id: "s2", name: "Bob Smith", email: "bob@techcorp.io", groups: ["Newsletter"], status: "active" as const, subscribedAt: "2024-02-01" },
  { id: "s3", name: "Carol Wu", email: "carol@startup.co", groups: ["Product Updates", "Beta Testers"], status: "active" as const, subscribedAt: "2024-02-14" },
  { id: "s4", name: "David Park", email: "david@enterprise.com", groups: ["Newsletter"], status: "unsubscribed" as const, subscribedAt: "2024-01-20" },
  { id: "s5", name: "Eva Martinez", email: "eva@agency.net", groups: ["Beta Testers"], status: "active" as const, subscribedAt: "2024-03-05" },
  { id: "s6", name: "Frank Liu", email: "frank@devco.io", groups: ["Newsletter", "Beta Testers"], status: "active" as const, subscribedAt: "2024-03-12" },
  { id: "s7", name: "Grace Kim", email: "grace@media.com", groups: ["Product Updates"], status: "active" as const, subscribedAt: "2024-03-20" },
  { id: "s8", name: "Henry Zhang", email: "henry@corp.cn", groups: ["Newsletter"], status: "active" as const, subscribedAt: "2024-04-01" },
];

export const mockGroups = [
  { id: "g1", name: "Newsletter", description: "Main newsletter subscribers", count: 5, lastCampaign: "Q1 Product Update" },
  { id: "g2", name: "Product Updates", description: "Users interested in product news", count: 4, lastCampaign: "New Feature: Analytics Dashboard" },
  { id: "g3", name: "Beta Testers", description: "Early access program members", count: 3, lastCampaign: "Beta v2.3 Release Notes" },
];

export const mockCampaigns = [
  { id: "c1", name: "Q1 Product Update", subject: "See what's new in Q1 2024", status: "sent" as const, groups: ["Newsletter"], recipients: 5, opens: 4, uniqueOpens: 3, clicks: 2, uniqueClicks: 1, bounces: 0, unsubscribes: 0, sentAt: "2024-03-15T10:00:00Z", templateId: "t1" },
  { id: "c2", name: "New Feature: Analytics Dashboard", subject: "Track everything with our new dashboard", status: "sent" as const, groups: ["Product Updates"], recipients: 4, opens: 3, uniqueOpens: 3, clicks: 2, uniqueClicks: 2, bounces: 0, unsubscribes: 0, sentAt: "2024-03-22T14:00:00Z", templateId: "t2" },
  { id: "c3", name: "Beta v2.3 Release Notes", subject: "Beta v2.3 is here - here's what changed", status: "sent" as const, groups: ["Beta Testers"], recipients: 3, opens: 3, uniqueOpens: 3, clicks: 3, uniqueClicks: 3, bounces: 0, unsubscribes: 0, sentAt: "2024-04-01T09:00:00Z", templateId: "t1" },
  { id: "c4", name: "April Newsletter", subject: "April updates and community highlights", status: "scheduled" as const, groups: ["Newsletter"], recipients: 5, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: "2024-04-15T10:00:00Z", templateId: "t2" },
  { id: "c5", name: "Summer Preview", subject: "A sneak peek at what's coming this summer", status: "draft" as const, groups: ["Newsletter", "Product Updates"], recipients: 0, opens: 0, uniqueOpens: 0, clicks: 0, uniqueClicks: 0, bounces: 0, unsubscribes: 0, sentAt: null, templateId: null },
];

export const mockTemplates = [
  { id: "t1", name: "Simple Newsletter", lastModified: "2024-03-10", color: "#6366f1" },
  { id: "t2", name: "Product Announcement", lastModified: "2024-03-18", color: "#0ea5e9" },
  { id: "t3", name: "Welcome Email", lastModified: "2024-02-28", color: "#10b981" },
  { id: "t4", name: "Event Invitation", lastModified: "2024-04-02", color: "#f59e0b" },
];

export const mockRecipientActivity = [
  { name: "Alice Chen", email: "alice@acme.com", opened: true, clicked: true },
  { name: "Bob Smith", email: "bob@techcorp.io", opened: true, clicked: false },
  { name: "Carol Wu", email: "carol@startup.co", opened: true, clicked: true },
  { name: "David Park", email: "david@enterprise.com", opened: false, clicked: false },
  { name: "Eva Martinez", email: "eva@agency.net", opened: true, clicked: false },
];
