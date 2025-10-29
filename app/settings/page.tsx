'use client';
import { useState, useEffect } from 'react';
import { libraryApi } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Updated interface to match the API structure
interface LibrarySettings {
  id: string;
  maxBooksPerUser: number;
  defaultLoanDays: number;
  maxRenewals: number;
  fineGraceDays: number;
  defaultDailyFine: number;
  maxFineAmount: number;
  digitalDownloadLimit: number;
  digitalAccessDays: number;
  enableReservations: boolean;
  reservationDays: number;
  dueDateReminderDays: number;
  overdueNoticeDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API response interface that handles both flat and nested structures
interface ApiSettingsResponse {
  id?: string;
  maxBooksPerUser?: number;
  defaultLoanDays?: number;
  maxRenewals?: number;
  fineGraceDays?: number;
  defaultDailyFine?: number;
  maxFineAmount?: number;
  digitalDownloadLimit?: number;
  digitalAccessDays?: number;
  enableReservations?: boolean;
  reservationDays?: number;
  dueDateReminderDays?: number;
  overdueNoticeDays?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  general?: {
    maxBorrowLimit?: number;
    reservationExpiryDays?: number;
  };
  borrowing?: {
    defaultLoanPeriod?: number;
    maxRenewals?: number;
    gracePeriodDays?: number;
    dailyFineAmount?: number;
    maxFineAmount?: number;
  };
  notifications?: {
    dueSoonReminderDays?: number;
    overdueReminderInterval?: number;
  };
}

const defaultSettings: LibrarySettings = {
  id: '',
  maxBooksPerUser: 5,
  defaultLoanDays: 14,
  maxRenewals: 2,
  fineGraceDays: 1,
  defaultDailyFine: 0,
  maxFineAmount: 50,
  digitalDownloadLimit: 3,
  digitalAccessDays: 7,
  enableReservations: false,
  reservationDays: 3,
  dueDateReminderDays: 2,
  overdueNoticeDays: 1,
  isActive: true,
  createdAt: '',
  updatedAt: ''
};

// Update payload interface
interface UpdateSettingsPayload {
  maxBooksPerUser: number;
  defaultLoanDays: number;
  maxRenewals: number;
  fineGraceDays: number;
  defaultDailyFine: number;
  maxFineAmount: number;
  digitalDownloadLimit: number;
  digitalAccessDays: number;
  enableReservations: boolean;
  reservationDays: number;
  dueDateReminderDays: number;
  overdueNoticeDays: number;
}

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
        // Transform the nested API response to flat structure
        const apiData = response.data as ApiSettingsResponse;
        
        // Handle both flat and nested structures with proper type checking
        const transformedSettings: LibrarySettings = {
          id: apiData.id || '',
          maxBooksPerUser: apiData.maxBooksPerUser ?? 
                           apiData.general?.maxBorrowLimit ?? 
                           defaultSettings.maxBooksPerUser,
          defaultLoanDays: apiData.defaultLoanDays ?? 
                          apiData.borrowing?.defaultLoanPeriod ?? 
                          defaultSettings.defaultLoanDays,
          maxRenewals: apiData.maxRenewals ?? 
                      apiData.borrowing?.maxRenewals ?? 
                      defaultSettings.maxRenewals,
          fineGraceDays: apiData.fineGraceDays ?? 
                        apiData.borrowing?.gracePeriodDays ?? 
                        defaultSettings.fineGraceDays,
          defaultDailyFine: apiData.defaultDailyFine ?? 
                          apiData.borrowing?.dailyFineAmount ?? 
                          defaultSettings.defaultDailyFine,
          maxFineAmount: apiData.maxFineAmount ?? 
                       apiData.borrowing?.maxFineAmount ?? 
                       defaultSettings.maxFineAmount,
          digitalDownloadLimit: apiData.digitalDownloadLimit ?? defaultSettings.digitalDownloadLimit,
          digitalAccessDays: apiData.digitalAccessDays ?? defaultSettings.digitalAccessDays,
          enableReservations: apiData.enableReservations ?? defaultSettings.enableReservations,
          reservationDays: apiData.reservationDays ?? 
                         apiData.general?.reservationExpiryDays ?? 
                         defaultSettings.reservationDays,
          dueDateReminderDays: apiData.dueDateReminderDays ?? 
                             apiData.notifications?.dueSoonReminderDays ?? 
                             defaultSettings.dueDateReminderDays,
          overdueNoticeDays: apiData.overdueNoticeDays ?? 
                           apiData.notifications?.overdueReminderInterval ?? 
                           defaultSettings.overdueNoticeDays,
          isActive: apiData.isActive ?? defaultSettings.isActive,
          createdAt: apiData.createdAt ?? defaultSettings.createdAt,
          updatedAt: apiData.updatedAt ?? defaultSettings.updatedAt
        };
        
        setSettings(transformedSettings);
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

      // Validate all required fields have values
      const validatedSettings: LibrarySettings = {
        ...settings,
        maxBooksPerUser: settings.maxBooksPerUser || defaultSettings.maxBooksPerUser,
        defaultLoanDays: settings.defaultLoanDays || defaultSettings.defaultLoanDays,
        maxRenewals: settings.maxRenewals || defaultSettings.maxRenewals,
        fineGraceDays: settings.fineGraceDays || defaultSettings.fineGraceDays,
        defaultDailyFine: settings.defaultDailyFine || defaultSettings.defaultDailyFine,
        maxFineAmount: settings.maxFineAmount || defaultSettings.maxFineAmount,
        digitalDownloadLimit: settings.digitalDownloadLimit || defaultSettings.digitalDownloadLimit,
        digitalAccessDays: settings.digitalAccessDays || defaultSettings.digitalAccessDays,
        reservationDays: settings.reservationDays || defaultSettings.reservationDays,
        dueDateReminderDays: settings.dueDateReminderDays || defaultSettings.dueDateReminderDays,
        overdueNoticeDays: settings.overdueNoticeDays || defaultSettings.overdueNoticeDays,
      };

      // Create update payload with only updatable fields
      const updatePayload: UpdateSettingsPayload = {
        maxBooksPerUser: validatedSettings.maxBooksPerUser,
        defaultLoanDays: validatedSettings.defaultLoanDays,
        maxRenewals: validatedSettings.maxRenewals,
        fineGraceDays: validatedSettings.fineGraceDays,
        defaultDailyFine: validatedSettings.defaultDailyFine,
        maxFineAmount: validatedSettings.maxFineAmount,
        digitalDownloadLimit: validatedSettings.digitalDownloadLimit,
        digitalAccessDays: validatedSettings.digitalAccessDays,
        enableReservations: validatedSettings.enableReservations,
        reservationDays: validatedSettings.reservationDays,
        dueDateReminderDays: validatedSettings.dueDateReminderDays,
        overdueNoticeDays: validatedSettings.overdueNoticeDays,
      };

      const response = await libraryApi.updateSettings(updatePayload);
      
      if (response.success) {
        toast.success('Settings saved successfully');
        setHasChanges(false);
        // Reload settings to get updated data with new timestamps
        await loadSettings();
      } else {
        setError(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (field: keyof LibrarySettings, value: string) => {
    // Convert string to appropriate type based on the field's default type
    const fieldType = typeof defaultSettings[field];
    let processedValue: string | number | boolean = value;
    
    if (fieldType === 'number') {
      // Allow empty string for manual input, convert to 0 only on save
      processedValue = value === '' ? '' : Number(value);
      // Ensure non-negative numbers for certain fields when not empty
      if (value !== '' && (
        field === 'maxBooksPerUser' || field === 'defaultLoanDays' || 
        field === 'maxRenewals' || field === 'fineGraceDays' || 
        field === 'defaultDailyFine' || field === 'maxFineAmount' ||
        field === 'digitalDownloadLimit' || field === 'digitalAccessDays' ||
        field === 'reservationDays' || field === 'dueDateReminderDays' ||
        field === 'overdueNoticeDays'
      )) {
        processedValue = Math.max(0, Number(value));
      }
    } else if (fieldType === 'boolean') {
      processedValue = value === 'true';
    }

    setSettings(prev => ({
      ...prev,
      [field]: processedValue
    }));
    setHasChanges(true);
  };

  const formatInputValue = (value: number | string): string => {
    return value === '' ? '' : value.toString();
  };

  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      setSettings(defaultSettings);
      setHasChanges(true);
    }
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
                type="button"
                onClick={handleResetToDefaults}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset to Defaults
              </button>
              <button
                type="button"
                onClick={handleSaveSettings}
                disabled={!hasChanges || saving}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors"
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
              type="button"
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
            {/* Borrowing Limits */}
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Borrowing Limits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="maxBooksPerUser" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Books Per User
                    </label>
                    <input
                      id="maxBooksPerUser"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.maxBooksPerUser)}
                      onChange={(e) => handleSettingChange('maxBooksPerUser', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter maximum books"
                    />
                  </div>

                  <div>
                    <label htmlFor="defaultLoanDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Default Loan Period (Days)
                    </label>
                    <input
                      id="defaultLoanDays"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.defaultLoanDays)}
                      onChange={(e) => handleSettingChange('defaultLoanDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter loan days"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxRenewals" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Renewals
                    </label>
                    <input
                      id="maxRenewals"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.maxRenewals)}
                      onChange={(e) => handleSettingChange('maxRenewals', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter maximum renewals"
                    />
                  </div>

                  <div>
                    <label htmlFor="fineGraceDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Fine Grace Period (Days)
                    </label>
                    <input
                      id="fineGraceDays"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.fineGraceDays)}
                      onChange={(e) => handleSettingChange('fineGraceDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter grace period days"
                    />
                  </div>
                </div>
              </div>

              {/* Fines & Penalties */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Fines & Penalties</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="defaultDailyFine" className="block text-sm font-medium text-gray-700 mb-1">
                      Daily Fine Amount (KSh)
                    </label>
                    <input
                      id="defaultDailyFine"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(settings.defaultDailyFine)}
                      onChange={(e) => handleSettingChange('defaultDailyFine', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter daily fine amount"
                    />
                  </div>

                  <div>
                    <label htmlFor="maxFineAmount" className="block text-sm font-medium text-gray-700 mb-1">
                      Maximum Fine Amount (KSh)
                    </label>
                    <input
                      id="maxFineAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formatInputValue(settings.maxFineAmount)}
                      onChange={(e) => handleSettingChange('maxFineAmount', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter maximum fine amount"
                    />
                  </div>
                </div>
              </div>

              {/* Digital Resources */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Digital Resources</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="digitalDownloadLimit" className="block text-sm font-medium text-gray-700 mb-1">
                      Digital Download Limit
                    </label>
                    <input
                      id="digitalDownloadLimit"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.digitalDownloadLimit)}
                      onChange={(e) => handleSettingChange('digitalDownloadLimit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter download limit"
                    />
                  </div>

                  <div>
                    <label htmlFor="digitalAccessDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Digital Access Days
                    </label>
                    <input
                      id="digitalAccessDays"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.digitalAccessDays)}
                      onChange={(e) => handleSettingChange('digitalAccessDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter access days"
                    />
                  </div>
                </div>
              </div>

              {/* Reservations */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Reservations</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between md:col-span-2">
                    <label htmlFor="enableReservations" className="text-sm font-medium text-gray-700">
                      Enable Reservations
                    </label>
                    <button
                      type="button"
                      id="enableReservations"
                      onClick={() => handleSettingChange('enableReservations', (!settings.enableReservations).toString())}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        settings.enableReservations ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                      role="switch"
                      aria-checked={settings.enableReservations}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          settings.enableReservations ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {settings.enableReservations && (
                    <div>
                      <label htmlFor="reservationDays" className="block text-sm font-medium text-gray-700 mb-1">
                        Reservation Hold Days
                      </label>
                      <input
                        id="reservationDays"
                        type="number"
                        min="0"
                        value={formatInputValue(settings.reservationDays)}
                        onChange={(e) => handleSettingChange('reservationDays', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                        placeholder="Enter reservation hold days"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Notifications */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dueDateReminderDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date Reminder (Days Before)
                    </label>
                    <input
                      id="dueDateReminderDays"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.dueDateReminderDays)}
                      onChange={(e) => handleSettingChange('dueDateReminderDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter reminder days"
                    />
                  </div>

                  <div>
                    <label htmlFor="overdueNoticeDays" className="block text-sm font-medium text-gray-700 mb-1">
                      Overdue Notice (Days After Due)
                    </label>
                    <input
                      id="overdueNoticeDays"
                      type="number"
                      min="0"
                      value={formatInputValue(settings.overdueNoticeDays)}
                      onChange={(e) => handleSettingChange('overdueNoticeDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      placeholder="Enter overdue notice days"
                    />
                  </div>
                </div>
              </div>

              {/* System Info */}
              <div className="border-t pt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">System Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                    <p className="text-gray-600">
                      {settings.updatedAt ? new Date(settings.updatedAt).toLocaleString() : 'Never'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                    <p className="text-gray-600">
                      {settings.createdAt ? new Date(settings.createdAt).toLocaleString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      settings.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {settings.isActive ? 'Active' : 'Inactive'}
                    </span>
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
                      type="button"
                      onClick={() => {
                        setHasChanges(false);
                        loadSettings();
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Discard Changes
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSettings}
                      disabled={saving}
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
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