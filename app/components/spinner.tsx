import Image from 'next/image';
import logo from '@/public/logo.png';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-black transition-colors duration-300">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner with logo inside */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-gray-300 border-t-indigo-600 dark:border-gray-700 dark:border-t-indigo-500" />
          <div className="absolute inset-2 flex items-center justify-center rounded-full bg-white dark:bg-gray-900 shadow-inner">
            <Image
              src={logo}
              alt="Logo"
              className="w-8 h-8 object-contain"
              priority
            />
          </div>
        </div>

        {/* Loading text */}
        <p className="text-gray-600 dark:text-gray-300 text-sm font-medium tracking-wide">
          Loading, please wait…
        </p>
      </div>
    </div>
  );
}
