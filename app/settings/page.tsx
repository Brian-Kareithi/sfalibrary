'use client';
import { useState, useEffect } from 'react';
import { libraryApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

interface LibrarySettings {
  general: {
    libraryName: string;
    libraryEmail: string;
    libraryPhone: string;
    libraryAddress: string;
    openingHours: string;
    maxBorrowLimit: number;
    reservationExpiryDays: number;
  };
  borrowing: {
    defaultLoanPeriod: number;
    maxRenewals: number;
    renewalExtensionDays: number;
    dailyFineAmount: number;
    maxFineAmount: number;
    gracePeriodDays: number;
  };
  notifications: {
    dueSoonReminderDays: number;
    overdueReminderInterval: number;
    sendEmailNotifications: boolean;
    sendSMSNotifications: boolean;
    autoSendReports: boolean;
  };
  security: {
    sessionTimeout: number;
    requireReauthentication: boolean;
    passwordExpiryDays: number;
    maxLoginAttempts: number;
  };
}

// Define a partial type for API settings that might be incomplete
type PartialLibrarySettings = {
  [K in keyof LibrarySettings]?: Partial<LibrarySettings[K]>;
};

const defaultSettings: LibrarySettings = {
  general: {
    libraryName: 'Steadfast School Library',
    libraryEmail: 'library@steadfastschool.ac.ke',
    libraryPhone: '+254 700 000000',
    libraryAddress: 'Steadfast School, Nairobi, Kenya',
    openingHours: '8:00 AM - 5:00 PM',
    maxBorrowLimit: 5,
    reservationExpiryDays: 3,
  },
  borrowing: {
    defaultLoanPeriod: 14,
    maxRenewals: 2,
    renewalExtensionDays: 14,
    dailyFineAmount: 50,
    maxFineAmount: 1000,
    gracePeriodDays: 1,
  },
  notifications: {
    dueSoonReminderDays: 3,
    overdueReminderInterval: 7,
    sendEmailNotifications: true,
    sendSMSNotifications: false,
    autoSendReports: true,
  },
  security: {
    sessionTimeout: 60,
    requireReauthentication: false,
    passwordExpiryDays: 90,
    maxLoginAttempts: 5,
  },
};

// Helper function to safely merge settings with defaults
const mergeSettingsWithDefaults = (apiSettings: PartialLibrarySettings | null): LibrarySettings => {
  if (!apiSettings) return defaultSettings;

  return {
    general: {
      ...defaultSettings.general,
      ...(apiSettings.general || {})
    },
    borrowing: {
      ...defaultSettings.borrowing,
      ...(apiSettings.borrowing || {})
    },
    notifications: {
      ...defaultSettings.notifications,
      ...(apiSettings.notifications || {})
    },
    security: {
      ...defaultSettings.security,
      ...(apiSettings.security || {})
    }
  };
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<LibrarySettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await libraryApi.getSettings();
      
      if (response.success && response.data) {
        const mergedSettings = mergeSettingsWithDefaults(response.data);
        setSettings(mergedSettings);
      } else {
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load settings');
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      const response = await libraryApi.updateSettings(settings);
      if (response.success) {
        toast.success('Settings saved successfully');
        setHasChanges(false);
      } else {
        setError('Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (
    section: keyof LibrarySettings,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  // Safe value getter with fallback
  const getSafeValue = (section: keyof LibrarySettings, field: string): string | number | boolean => {
    const sectionData = settings[section];
    if (sectionData && field in sectionData) {
      return sectionData[field as keyof typeof sectionData];
    }
    return '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Library Settings</h1>
              <p className="text-gray-600 mt-1">Configure your library management system</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleResetToDefaults}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!hasChanges || saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-md transition-colors"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            {/* General Settings */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Library Name
                    </label>
                    <input
                      type="text"
                      value={getSafeValue('general', 'libraryName') as string}
                      onChange={(e) => handleSettingChange('general', 'libraryName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Library Email
                    </label>
                    <input
                      type="email"
                      value={getSafeValue('general', 'libraryEmail') as string}
                      onChange={(e) => handleSettingChange('general', 'libraryEmail', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={getSafeValue('general', 'libraryPhone') as string}
                      onChange={(e) => handleSettingChange('general', 'libraryPhone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Borrow Limit
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={getSafeValue('general', 'maxBorrowLimit') as number}
                      onChange={(e) => handleSettingChange('general', 'maxBorrowLimit', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Library Address
                    </label>
                    <textarea
                      value={getSafeValue('general', 'libraryAddress') as string}
                      onChange={(e) => handleSettingChange('general', 'libraryAddress', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Opening Hours
                    </label>
                    <input
                      type="text"
                      value={getSafeValue('general', 'openingHours') as string}
                      onChange={(e) => handleSettingChange('general', 'openingHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reservation Expiry (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={getSafeValue('general', 'reservationExpiryDays') as number}
                      onChange={(e) => handleSettingChange('general', 'reservationExpiryDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Borrowing Rules */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Borrowing Rules</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Default Loan Period (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={getSafeValue('borrowing', 'defaultLoanPeriod') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'defaultLoanPeriod', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Renewals
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={getSafeValue('borrowing', 'maxRenewals') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'maxRenewals', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Renewal Extension (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={getSafeValue('borrowing', 'renewalExtensionDays') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'renewalExtensionDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Grace Period (Days)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="7"
                      value={getSafeValue('borrowing', 'gracePeriodDays') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'gracePeriodDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Fine Amount (KSh)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1000"
                      step="10"
                      value={getSafeValue('borrowing', 'dailyFineAmount') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'dailyFineAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Fine Amount (KSh)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      step="10"
                      value={getSafeValue('borrowing', 'maxFineAmount') as number}
                      onChange={(e) => handleSettingChange('borrowing', 'maxFineAmount', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Soon Reminder (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="14"
                      value={getSafeValue('notifications', 'dueSoonReminderDays') as number}
                      onChange={(e) => handleSettingChange('notifications', 'dueSoonReminderDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Overdue Reminder Interval (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={getSafeValue('notifications', 'overdueReminderInterval') as number}
                      onChange={(e) => handleSettingChange('notifications', 'overdueReminderInterval', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                        <button
                          onClick={() => handleSettingChange('notifications', 'sendEmailNotifications', !(getSafeValue('notifications', 'sendEmailNotifications') as boolean))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            getSafeValue('notifications', 'sendEmailNotifications') ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              getSafeValue('notifications', 'sendEmailNotifications') ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                        <button
                          onClick={() => handleSettingChange('notifications', 'sendSMSNotifications', !(getSafeValue('notifications', 'sendSMSNotifications') as boolean))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            getSafeValue('notifications', 'sendSMSNotifications') ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              getSafeValue('notifications', 'sendSMSNotifications') ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-gray-700">Auto-send Reports</label>
                        <button
                          onClick={() => handleSettingChange('notifications', 'autoSendReports', !(getSafeValue('notifications', 'autoSendReports') as boolean))}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            getSafeValue('notifications', 'autoSendReports') ? 'bg-blue-600' : 'bg-gray-300'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              getSafeValue('notifications', 'autoSendReports') ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Security</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Session Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max="480"
                      value={getSafeValue('security', 'sessionTimeout') as number}
                      onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password Expiry (Days)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="365"
                      value={getSafeValue('security', 'passwordExpiryDays') as number}
                      onChange={(e) => handleSettingChange('security', 'passwordExpiryDays', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Login Attempts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={getSafeValue('security', 'maxLoginAttempts') as number}
                      onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    />
                  </div>

                  <div className="flex items-center justify-between md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Require Reauthentication</label>
                    <button
                      onClick={() => handleSettingChange('security', 'requireReauthentication', !(getSafeValue('security', 'requireReauthentication') as boolean))}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        getSafeValue('security', 'requireReauthentication') ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          getSafeValue('security', 'requireReauthentication') ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Bar */}
            {hasChanges && (
              <div className="border-t border-gray-200 bg-gray-50 -mx-6 -mb-6 mt-6 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    You have unsaved changes
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => {
                        setHasChanges(false);
                        loadSettings();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Discard Changes
                    </button>
                    <button
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-gray-400"
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}