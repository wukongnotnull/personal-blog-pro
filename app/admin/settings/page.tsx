export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Settings</h1>

      <div className="max-w-2xl space-y-6">
        <div className="p-6 rounded-lg border border-border bg-surface">
          <h2 className="text-lg font-medium mb-4">Site Information</h2>
          <p className="text-sm text-text-muted mb-4">
            Site settings are configured through environment variables.
          </p>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">
                Site URL
              </label>
              <input
                type="text"
                value={process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}
                disabled
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-text opacity-60"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-lg border border-border bg-surface">
          <h2 className="text-lg font-medium mb-4">Danger Zone</h2>
          <p className="text-sm text-text-muted mb-4">
            These actions are irreversible. Proceed with caution.
          </p>
          <button
            type="button"
            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
            disabled
          >
            Clear Analytics Data
          </button>
        </div>
      </div>
    </div>
  );
}
