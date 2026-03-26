/**
 * app/admin/garages/page.jsx
 * MOTmatch — Admin: Garage Import Validation
 *
 * Shows import stats and last 50 imported garages.
 * Server component — fetches directly from Supabase.
 *
 * Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY to .env.local
 */

import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Supabase env vars not set');
  return createClient(url, key, { auth: { persistSession: false } });
}

const STATUS_STYLES = {
  enriched: 'bg-green-100 text-green-800',
  pending:  'bg-yellow-100 text-yellow-800',
  failed:   'bg-red-100 text-red-800',
};

export const dynamic = 'force-dynamic'; // always fresh — no cache

export default async function AdminGaragesPage() {
  const supabase = getSupabase();

  // 1. Total count
  const { count: total } = await supabase
    .from('garages')
    .select('*', { count: 'exact', head: true });

  // 2. Counts by enrichment_status
  const { data: statusRows } = await supabase
    .from('garages')
    .select('enrichment_status')
    .order('enrichment_status');

  const statusCounts = (statusRows ?? []).reduce((acc, r) => {
    acc[r.enrichment_status] = (acc[r.enrichment_status] ?? 0) + 1;
    return acc;
  }, {});

  // 3. Last 50 imported
  const { data: recent, error } = await supabase
    .from('garages')
    .select('id, name, postcode, phone, enrichment_status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    return (
      <div className="p-8 text-red-600">
        Failed to load garage data: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        MOTmatch — Garage Import Admin
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
        <StatCard label="Total Garages" value={total ?? 0} colour="blue" />
        <StatCard
          label="Enriched"
          value={statusCounts.enriched ?? 0}
          colour="green"
        />
        <StatCard
          label="Pending"
          value={statusCounts.pending ?? 0}
          colour="yellow"
        />
        <StatCard
          label="Failed"
          value={statusCounts.failed ?? 0}
          colour="red"
        />
      </div>

      {/* Recent imports table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">
            Last 50 Imported
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Postcode', 'Phone', 'Status', 'Imported'].map(h => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {(recent ?? []).map(g => (
                <tr key={g.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 font-medium text-gray-900 max-w-xs truncate">
                    {g.name || <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-3 text-gray-600 font-mono">
                    {g.postcode}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {g.phone || <span className="text-gray-400 italic">—</span>}
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_STYLES[g.enrichment_status] ?? 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {g.enrichment_status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-500 text-xs">
                    {new Date(g.created_at).toLocaleString('en-GB')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, colour }) {
  const colours = {
    blue:   'bg-blue-50 text-blue-700 border-blue-200',
    green:  'bg-green-50 text-green-700 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    red:    'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <div className={`rounded-xl border p-5 ${colours[colour] ?? colours.blue}`}>
      <p className="text-sm font-medium opacity-70">{label}</p>
      <p className="text-3xl font-bold mt-1">{value.toLocaleString()}</p>
    </div>
  );
}
