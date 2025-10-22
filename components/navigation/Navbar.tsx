'use client';

import React from 'react';
import Link from 'next/link';

export type NavItem = { label: string; href: string; children?: Array<{ label: string; href: string }> };

type NavbarProps = {
  items: NavItem[];
  cta?: { label: string; href: string };
  className?: string;
};

export function Navbar({ items, cta, className }: NavbarProps) {
  const [open, setOpen] = React.useState(false);
  const navRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current;
    const setVar = () => {
      const h = el.getBoundingClientRect().height;
      document.documentElement.style.setProperty('--nav-h', `${Math.ceil(h)}px`);
    };
    setVar();
    const ro = new ResizeObserver(setVar);
    ro.observe(el);
    window.addEventListener('resize', setVar);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', setVar);
    };
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-20 ${className || ''}`}
      style={{ backgroundColor: 'rgba(13, 13, 24, 0.3)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: '0 0 15px 15px' }}
    >
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <Link href="/" className="text-white">tailark</Link>

          <div className="hidden lg:flex items-center space-x-6">
            {items.map((it) => (
              <div key={it.label} className="relative group">
                <Link href={it.href} className="text-sm text-gray-300 hover:text-white flex items-center">
                  {it.label}
                </Link>
                {!!it.children?.length && (
                  <div
                    className="absolute left-0 mt-2 w-48 bg-black bg-opacity-50 rounded-md shadow-lg py-2 border border-gray-700/30 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-30"
                    style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
                  >
                    {it.children.map((c) => (
                      <Link key={c.label} href={c.href} className="block px-4 py-2 text-sm text-gray-300 hover:text-gray-100 hover:bg-gray-800/30 transition duration-150">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-4 md:space-x-6">
          {cta && (
            <Link
              href={cta.href}
              className="bg-[#8200DB29] hover:bg-black/50 text-white font-semibold py-2 px-5 rounded-full text-sm md:text-base border border-[#322D36]"
              style={{ backdropFilter: 'blur(8px)' }}
            >
              {cta.label}
            </Link>
          )}
          <button className="lg:hidden text-white p-2" onClick={() => setOpen(!open)} aria-label="Toggle mobile menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} /></svg>
          </button>
        </div>
      </div>

      <div
        className={`lg:hidden bg-black bg-opacity-50 border-t border-gray-700/30 absolute top-full left-0 right-0 z-30 overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-screen opacity-100 pointer-events-auto' : 'max-h-0 opacity-0 pointer-events-none'}`}
        style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
      >
        <div className="px-4 py-6 flex flex-col space-y-4">
          {items.map((it) => (
            <div key={it.label} className="relative">
              <Link href={it.href} className="text-gray-300 hover:text-gray-100 text-sm py-2 transition duration-150">
                {it.label}
              </Link>
              {!!it.children?.length && (
                <div className="pl-4 space-y-2 mt-2">
                  {it.children.map((c) => (
                    <Link key={c.label} href={c.href} className="block text-gray-300 hover:text-gray-100 text-sm py-1 transition duration-150">
                      {c.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


