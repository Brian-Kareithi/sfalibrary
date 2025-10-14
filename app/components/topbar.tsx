'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import logo from '@/public/logo.png';

interface NavbarProps {
  activeTab?: 'view' | 'update' | 'allocate';
  onTabChange?: (tab: 'view' | 'update' | 'allocate') => void;
}

const Navbar = ({ activeTab, onTabChange }: NavbarProps) => {
  const pathname = usePathname();
  
  // Only show tabs on the main uniform page
  const showTabs = pathname === '/' || pathname === '/uniforms';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 w-full bg-[#011C40]/90 backdrop-blur-xl border-b border-[#26658C]/30 flex items-center justify-between px-8 py-4">
      {/* Left: Logo */}
      <div className="flex items-center space-x-3">
        <Image src={logo} alt="Logo" width={32} height={32} className="rounded-lg" />
        <span className="text-xl font-light text-white tracking-wide">Steadfast Portal</span>
      </div>

      {/* Center: Tabs (only on uniform pages) */}
      {showTabs && onTabChange && (
        <div className="flex space-x-1 bg-[#023859]/50 rounded-xl p-1 backdrop-blur-sm border border-[#26658C]/20">
          {[
            { key: 'view', label: 'View Items' },
            { key: 'update', label: 'Update Items' },
            { key: 'allocate', label: 'Allocate Uniforms' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key as 'view' | 'update' | 'allocate')}
              className={`px-6 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-[#54ACBF] to-[#26658C] text-white shadow-lg'
                  : 'text-[#A7EBF2] hover:text-white hover:bg-[#26658C]/30'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Right: Empty space for balance */}
      <div className="w-20"></div>
    </div>
  );
};

export default Navbar;