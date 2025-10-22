'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import logo from '@/public/logo.png';

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  tabs?: { key: string; label: string }[];
}

const Navbar = ({ activeTab, onTabChange, tabs = [] }: NavbarProps) => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showTabs = tabs.length > 0 && onTabChange;

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? 'bg-[#011C40]/95 backdrop-blur-xl shadow-2xl shadow-blue-900/20 border-b border-[#26658C]/40' 
        : 'bg-[#011C40]/90 backdrop-blur-lg border-b border-[#26658C]/30'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="relative">
              <Image 
                src={logo} 
                alt="Steadfast Portal" 
                width={40} 
                height={40} 
                className="rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3" 
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#54ACBF] to-[#26658C] rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-semibold bg-gradient-to-r from-white to-[#A7EBF2] bg-clip-text text-transparent tracking-tight">
              Steadfast Portal
            </span>
          </div>

          {/* Navigation Tabs */}
          {showTabs && (
            <div className="flex space-x-2 bg-[#023859]/40 rounded-2xl p-2 backdrop-blur-sm border border-[#26658C]/30 shadow-inner">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => onTabChange(tab.key)}
                  className={`px-8 py-3 rounded-xl transition-all duration-300 font-medium text-sm min-w-[120px] ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-[#54ACBF] to-[#26658C] text-white shadow-lg shadow-blue-500/25 transform scale-105'
                      : 'text-[#A7EBF2] hover:text-white hover:bg-[#26658C]/40 hover:transform hover:scale-105'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          {/* User Menu Placeholder */}
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#54ACBF] to-[#26658C] flex items-center justify-center text-white font-semibold text-sm shadow-lg">
              U
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#54ACBF] to-transparent opacity-50" />
    </nav>
  );
};

export default Navbar;