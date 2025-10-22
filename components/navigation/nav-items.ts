import type { NavItem } from '@/components/navigation/Navbar';

export const siteNavItems: NavItem[] = [
  {
    label: 'Features',
    href: '#',
    children: [
      { label: 'Mint Certificate', href: '/mint' },
      { label: 'Feature 2', href: '#' },
      { label: 'Feature 3', href: '#' },
    ],
  },
  {
    label: 'Enterprise',
    href: '#',
    children: [
      { label: 'Solution A', href: '#' },
      { label: 'Solution B', href: '#' },
    ],
  },
  {
    label: 'Resources',
    href: '#',
    children: [
      { label: 'Blog', href: '#' },
      { label: 'Docs', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  { label: 'Pricing', href: '#' },
];


