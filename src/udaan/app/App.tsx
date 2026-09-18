import { lazy, Suspense, useState } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppHeader } from '@udaan/components/layout/AppHeader';
import { ExplorePage } from '@udaan/pages/Explore/ExplorePage';

const AnalyticsPage = lazy(() => import('@udaan/pages/Analytics/AnalyticsPage'));
const DataOperationsPage = lazy(() => import('@udaan/pages/DataOperations/DataOperationsPage'));
const BackendSettingsPage = lazy(() => import('@udaan/pages/BackendSettings/BackendSettingsPage'));

function PageFallback() {
  return <div className="udaan-card">Loading…</div>;
}

export function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  return (
    <div className="udaan-app">
      <AppHeader
        searchValue={searchQuery}
        onSearch={(q) => {
          setSearchQuery(q);
        }}
      />
      <main className="udaan-main" key={location.pathname}>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<ExplorePage searchQuery={searchQuery} />} />
            <Route path="/explore" element={<ExplorePage searchQuery={searchQuery} />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/data-operations" element={<DataOperationsPage />} />
            <Route path="/settings/backend" element={<BackendSettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
