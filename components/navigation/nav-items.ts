import type { NavItem } from '@/components/navigation/Navbar';

export const siteNavItems: NavItem[] = [
  {
    label: 'Features',
    href: '#',
    children: [
      { label: 'Mint Certificate', href: '/mint/certificate' },
      { label: 'Mint Creative', href: '/mint/creative' },
      { label: 'Verify Certificate', href: '/verify/certificate' },
      { label: 'Verify Creative', href: '/verify/creative' },
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


