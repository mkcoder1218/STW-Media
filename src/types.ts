/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenType = 'home' | 'contact';

export interface ChannelStat {
  id: string;
  value: string;
  label: string;
  iconName: 'hub' | 'movie' | 'visibility';
  offset?: boolean;
}

export interface ServiceItem {
  id: string;
  num: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  id: string;
  num: string;
  phaseName: string;
  title: string;
  description: string;
}

export interface CaseStudy {
  id: string;
  tag: string;
  title: string;
  statChange: string;
  statLabel: string;
  statValue: string;
  statValueLabel: string;
  imageUrl: string;
}

export interface InquiryFormData {
  fullName: string;
  emailAddress: string;
  brandName: string;
  youtubeUrl: string;
  monthlyViews: string;
  monthlyBudget: string;
  servicesInterested: string[];
  message: string;
}
