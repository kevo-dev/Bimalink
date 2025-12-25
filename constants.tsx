
import { Product, InsuranceType, BlogPost } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Jubilee Motoring Plus',
    provider: 'Jubilee Insurance',
    type: InsuranceType.MOTOR,
    basePrice: 12500,
    benefits: ['Comprehensive coverage', '24/7 Roadside assistance', 'Windscreen cover', 'Excess protector'],
    description: 'Leading motor insurance in East Africa with rapid claim settlement.',
    rating: 4.8,
    logo: 'https://images.unsplash.com/photo-1549890762-0a3f8933ad76?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '2',
    name: 'Britam Milele Health',
    provider: 'Britam',
    type: InsuranceType.HEALTH,
    basePrice: 15000,
    benefits: ['Inpatient up to 10M', 'Maternity cover', 'Chronic conditions included', 'Global referral'],
    description: 'Comprehensive medical insurance for individuals and families.',
    rating: 4.7,
    logo: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '3',
    name: 'APA Afya Nafuu',
    provider: 'APA Insurance',
    type: InsuranceType.HEALTH,
    basePrice: 8500,
    benefits: ['Affordable premiums', 'Inpatient & Outpatient', 'Dental/Optical options', 'Last expense'],
    description: 'Budget-friendly healthcare for growing Kenyan families.',
    rating: 4.5,
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '4',
    name: 'UAP Old Mutual Motor',
    provider: 'UAP Old Mutual',
    type: InsuranceType.MOTOR,
    basePrice: 11000,
    benefits: ['Loss of keys cover', 'Personal accident', 'Authorized repairers', 'Political violence cover'],
    description: 'High-tier protection for your luxury and utility vehicles.',
    rating: 4.6,
    logo: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '5',
    name: 'GA Smart Travel',
    provider: 'GA Insurance',
    type: InsuranceType.TRAVEL,
    basePrice: 2500,
    benefits: ['Emergency medical', 'Baggage loss', 'Trip cancellation', 'COVID-19 cover'],
    description: 'Worry-free travel with worldwide assistance networks.',
    rating: 4.9,
    logo: 'https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: '6',
    name: 'Madison Life Planner',
    provider: 'Madison Insurance',
    type: InsuranceType.LIFE,
    basePrice: 5000,
    benefits: ['Education savings', 'Retirement plan', 'Term life benefits', 'Bonus payments'],
    description: 'Secure your family\'s future with flexible savings plans.',
    rating: 4.4,
    logo: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=100'
  }
];

export const MOCK_BLOGS: BlogPost[] = [
  {
    id: 'b1',
    title: 'New Motor Insurance Regulations in Kenya 2024',
    excerpt: 'IRA announces new guidelines for motor valuation and premium calculations as the industry moves towards digitalization.',
    date: 'Oct 24, 2023',
    author: 'Admin',
    source: 'Business Daily',
    imageUrl: 'https://images.unsplash.com/photo-1517672651691-24622a91b550?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'b2',
    title: 'Top 5 Health Insurance Providers for Families',
    excerpt: 'Comparing inpatient limits and outpatient benefits across major players to help you choose the best medical cover.',
    date: 'Nov 12, 2023',
    author: 'Insurance Guru',
    source: 'The Standard',
    imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&q=80&w=1200'
  },
  {
    id: 'b3',
    title: 'Why Travel Insurance is Mandatory for Schengen Visas',
    excerpt: 'Understanding the minimum requirements for European travel coverage and how to ensure your policy is compliant.',
    date: 'Dec 05, 2023',
    author: 'Travel Experts',
    source: 'Citizen Digital',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=1200'
  }
];
