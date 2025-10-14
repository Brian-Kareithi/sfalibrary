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

const defaultSettings: LibrarySettings = {
  general: {
    libraryName: '',
    libraryEmail: '',
    libraryPhone: '',
    libraryAddress: '',
    openingHours: '9:00 AM - 6:00 PM',
    maxBorrowLimit: 5,
    reservationExpiryDays: 3,
  },
  borrowing: {
    defaultLoanPeriod: 14,
    maxRenewals: 2,
    renewalExtensionDays: 14,
    dailyFineAmount: 0.50,
    maxFineAmount: 50.00,
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

// Helper function to safely merge API response with defaults
const mergeSettings = (apiSettings: any): LibrarySettings => {
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
  const [activeSection, setActiveSection] = useState<'general' | 'borrowing' | 'notifications' | 'security'>('general');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await libraryApi.getSettings();
      
      // Debug: log the API response to see actual structure
      console.log('API Response:', response);
      
      if (response.success) {
        const mergedSettings = mergeSettings(response.data);
        setSettings(mergedSettings);
      } else {
        // If API fails, use defaults but don't throw error
        console.warn('API returned unsuccessful, using default settings');
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load settings. Using default configuration.');
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

  const handleSettingChange = (section: keyof LibrarySettings, field: string, value: any) => {
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
    if (confirm('Are you sure you want to reset all settings to default values? This action cannot be undone.')) {
      setSettings(defaultSettings);
      setHasChanges(true);
    }
  };

  // Safe value getter with fallback
  const getSafeValue = (section: keyof LibrarySettings, field: string) => {
    if (!settings[section]) return '';
    return (settings[section] as any)[field] ?? '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Library Settings</h1>
              <p className="text-gray-600">Configure your library management system</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleResetToDefaults}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSaveSettings}
                disabled={!hasChanges || saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
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
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <div className="ml-auto pl-3">
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
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="space-y-2">
                {[
                  { id: 'general' as const, label: 'General Settings', icon: '⚙️' },
                  { id: 'borrowing' as const, label: 'Borrowing Rules', icon: '📚' },
                  { id: 'notifications' as const, label: 'Notifications', icon: '🔔' },
                  { id: 'security' as const, label: 'Security', icon: '🔒' },
                ].map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <span>{section.label}</span>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          {/* Settings Content */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                {/* General Settings */}
                {activeSection === 'general' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">General Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Library Name *
                        </label>
                        <input
                          type="text"
                          value={settings.general?.libraryName || ''}
                          onChange={(e) => handleSettingChange('general', 'libraryName', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter library name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Library Email *
                        </label>
                        <input
                          type="email"
                          value={settings.general?.libraryEmail || ''}
                          onChange={(e) => handleSettingChange('general', 'libraryEmail', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="library@example.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={settings.general?.libraryPhone || ''}
                          onChange={(e) => handleSettingChange('general', 'libraryPhone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Borrow Limit *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={settings.general?.maxBorrowLimit || 5}
                          onChange={(e) => handleSettingChange('general', 'maxBorrowLimit', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum number of books a user can borrow at once</p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Library Address
                      </label>
                      <textarea
                        value={settings.general?.libraryAddress || ''}
                        onChange={(e) => handleSettingChange('general', 'libraryAddress', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter full library address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Opening Hours
                        </label>
                        <input
                          type="text"
                          value={settings.general?.openingHours || ''}
                          onChange={(e) => handleSettingChange('general', 'openingHours', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="9:00 AM - 6:00 PM"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Reservation Expiry (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.general?.reservationExpiryDays || 3}
                          onChange={(e) => handleSettingChange('general', 'reservationExpiryDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days before a reservation expires</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Borrowing Rules */}
                {activeSection === 'borrowing' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Borrowing Rules</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Loan Period (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settings.borrowing?.defaultLoanPeriod || 14}
                          onChange={(e) => handleSettingChange('borrowing', 'defaultLoanPeriod', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Standard borrowing period in days</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Renewals *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={settings.borrowing?.maxRenewals || 2}
                          onChange={(e) => handleSettingChange('borrowing', 'maxRenewals', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum number of times a loan can be renewed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Renewal Extension (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settings.borrowing?.renewalExtensionDays || 14}
                          onChange={(e) => handleSettingChange('borrowing', 'renewalExtensionDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days added when a loan is renewed</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Grace Period (Days) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="7"
                          value={settings.borrowing?.gracePeriodDays || 1}
                          onChange={(e) => handleSettingChange('borrowing', 'gracePeriodDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days before fines start accruing</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Daily Fine Amount ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.01"
                          value={settings.borrowing?.dailyFineAmount || 0.50}
                          onChange={(e) => handleSettingChange('borrowing', 'dailyFineAmount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Fine amount per day after grace period</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Fine Amount ($) *
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.01"
                          value={settings.borrowing?.maxFineAmount || 50.00}
                          onChange={(e) => handleSettingChange('borrowing', 'maxFineAmount', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Maximum fine amount per book</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Notifications */}
                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Notification Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Soon Reminder (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="14"
                          value={settings.notifications?.dueSoonReminderDays || 3}
                          onChange={(e) => handleSettingChange('notifications', 'dueSoonReminderDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days before due date to send reminder</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Overdue Reminder Interval (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={settings.notifications?.overdueReminderInterval || 7}
                          onChange={(e) => handleSettingChange('notifications', 'overdueReminderInterval', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days between overdue reminders</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                          <p className="text-xs text-gray-500">Send notifications via email</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('notifications', 'sendEmailNotifications', !settings.notifications?.sendEmailNotifications)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.notifications?.sendEmailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.notifications?.sendEmailNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">SMS Notifications</label>
                          <p className="text-xs text-gray-500">Send notifications via SMS</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('notifications', 'sendSMSNotifications', !settings.notifications?.sendSMSNotifications)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.notifications?.sendSMSNotifications ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.notifications?.sendSMSNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Auto-send Reports</label>
                          <p className="text-xs text-gray-500">Automatically send weekly reports</p>
                        </div>
                        <button
                          onClick={() => handleSettingChange('notifications', 'autoSendReports', !settings.notifications?.autoSendReports)}
                          className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            settings.notifications?.autoSendReports ? 'bg-blue-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.notifications?.autoSendReports ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security */}
                {activeSection === 'security' && (
                  <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (Minutes) *
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="480"
                          value={settings.security?.sessionTimeout || 60}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Minutes before automatic logout</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password Expiry (Days) *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="365"
                          value={settings.security?.passwordExpiryDays || 90}
                          onChange={(e) => handleSettingChange('security', 'passwordExpiryDays', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Days before password expires</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Maximum Login Attempts *
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={settings.security?.maxLoginAttempts || 5}
                          onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <p className="text-xs text-gray-500 mt-1">Failed attempts before account lock</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Require Reauthentication</label>
                        <p className="text-xs text-gray-500">Require password for sensitive actions</p>
                      </div>
                      <button
                        onClick={() => handleSettingChange('security', 'requireReauthentication', !settings.security?.requireReauthentication)}
                        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                          settings.security?.requireReauthentication ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                            settings.security?.requireReauthentication ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Bar */}
              {hasChanges && (
                <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
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
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Discard Changes
                      </button>
                      <button
                        onClick={handleSaveSettings}
                        disabled={saving}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:bg-gray-400"
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}