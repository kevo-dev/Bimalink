
export enum InsuranceType {
  MOTOR = 'Motor',
  HEALTH = 'Health',
  LIFE = 'Life',
  TRAVEL = 'Travel',
  BUSINESS = 'Business'
}

export interface Product {
  id: string;
  name: string;
  provider: string;
  type: InsuranceType;
  basePrice: number;
  benefits: string[];
  description: string;
  rating: number;
  logo: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  source: string;
  imageUrl: string;
}

export interface CommunityPost {
  id: string;
  author: string;
  content: string;
  likes: number;
  replies: CommunityReply[];
  timestamp: string;
}

export interface CommunityReply {
  id: string;
  author: string;
  content: string;
  timestamp: string;
}

export interface Lead {
  name: string;
  email: string;
  phone: string;
  insuranceType: InsuranceType;
  message?: string;
}
