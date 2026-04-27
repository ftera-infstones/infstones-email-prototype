import type { Campaign, CampaignStatus, Subscriber, SubscriberStatus, Group, Template } from "../mock/data";
import { Get, Post, Put, Delete } from "../utils/http";

export type { Campaign, Subscriber, Group, Template };

export interface TemplateDetail extends Template {
  blocks?: Array<{
    id: string;
    type: string;
    content?: string;
    subContent?: string;
    bgColor?: string;
    textColor?: string;
    align?: string;
    fontSize?: number;
    buttonText?: string;
    buttonLink?: string;
    buttonColor?: string;
    imageUrl?: string;
    imageAlt?: string;
  }>;
}

export interface DashboardMetrics {
  totalSubscribers: number;
  campaignsSent: number;
  avgOpenRate: number;
  avgClickRate: number;
  bounceRate: number;
  trend: Array<{ date: string; sent: number; openRate: number; clickRate: number }>;
  recentCampaigns: Campaign[];
}

export interface AppSettings {
  id: string;
  orgName: string;
  defaultFromName: string;
  defaultFromEmail: string;
  sesRegion: string;
  s3Bucket: string;
  defaultUtm: { source: string; medium: string };
}

interface ApiResponse<T> {
  code: number;
  data: T;
  message: string;
}

type CampaignPayload = Partial<Campaign & {
  previewText?: string;
  fromName?: string;
  fromEmail?: string;
  htmlContent?: string;
  scheduleDate?: string;
  scheduleTime?: string;
  utm?: Record<string, string>;
}>;

async function req<T>(path: string, init?: { method?: string; body?: string }): Promise<T> {
  const method = (init?.method ?? "GET").toUpperCase();
  const data = init?.body ? JSON.parse(init.body) : undefined;

  let res;
  if (method === "POST") res = await Post<ApiResponse<T>>(path, data);
  else if (method === "PUT") res = await Put<ApiResponse<T>>(path, data);
  else if (method === "DELETE") res = await Delete<ApiResponse<T>>(path);
  else res = await Get<ApiResponse<T>>(path);

  const json = res?.data;
  if (!json || json.code !== 0) throw new Error(json?.message ?? "Request failed");
  return json.data;
}

const qs = (params: Record<string, string | undefined>) => {
  const s = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v) s.set(k, v);
  const str = s.toString();
  return str ? `?${str}` : "";
};

export const api = {
  campaigns: {
    list: (status?: CampaignStatus) =>
      req<Campaign[]>(`/campaigns${qs({ status })}`),
    getById: (id: string) => req<Campaign>(`/campaigns/${id}`),
    create: (data: CampaignPayload) =>
      req<Campaign>("/campaigns", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: CampaignPayload) =>
      req<Campaign>(`/campaigns/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<null>(`/campaigns/${id}`, { method: "DELETE" }),
    duplicate: (id: string) =>
      req<Campaign>(`/campaigns/${id}/duplicate`, { method: "POST" }),
  },
  subscribers: {
    list: (params?: { status?: SubscriberStatus; group?: string }) =>
      req<Subscriber[]>(`/subscribers${qs(params ?? {})}`),
    getById: (id: string) => req<Subscriber>(`/subscribers/${id}`),
    create: (data: Partial<Subscriber>) =>
      req<Subscriber>("/subscribers", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Subscriber>) =>
      req<Subscriber>(`/subscribers/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<null>(`/subscribers/${id}`, { method: "DELETE" }),
  },
  groups: {
    list: () => req<Group[]>("/groups"),
    create: (data: { name: string; description: string }) =>
      req<Group>("/groups", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Group>) =>
      req<Group>(`/groups/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<null>(`/groups/${id}`, { method: "DELETE" }),
  },
  templates: {
    list: () => req<Template[]>("/templates"),
    getById: (id: string) => req<TemplateDetail>("/templates/" + id),
    create: (data: Partial<Template> & { blocks?: TemplateDetail["blocks"] }) =>
      req<Template>("/templates", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Template> & { blocks?: TemplateDetail["blocks"] }) =>
      req<Template>(`/templates/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id: string) =>
      req<null>(`/templates/${id}`, { method: "DELETE" }),
  },
  dashboard: {
    getMetrics: () => req<DashboardMetrics>("/dashboard/metrics"),
  },
  settings: {
    get: () => req<AppSettings>("/settings"),
    update: (data: Partial<AppSettings>) =>
      req<AppSettings>("/settings", { method: "PUT", body: JSON.stringify(data) }),
  },
};
