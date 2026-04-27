import { Routes, Route, Navigate } from "react-router-dom";
import { RoleProvider } from "./context/RoleContext";
import { useRole } from "./context/RoleContext";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Campaigns from "./pages/Campaigns";
import CampaignCreate from "./pages/CampaignCreate";
import CampaignReport from "./pages/CampaignReport";
import Subscribers from "./pages/Subscribers";
import Groups from "./pages/Groups";
import Templates from "./pages/Templates";
import TemplateEditor from "./pages/TemplateEditor";
import Settings from "./pages/Settings";

function SettingsGuard() {
  const { isAdmin } = useRole();
  return isAdmin ? <Settings /> : <Navigate to="/dashboard" replace />;
}

export default function App() {
  return (
    <RoleProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/campaigns" element={<Campaigns />} />
          <Route path="/campaigns/new" element={<CampaignCreate />} />
          <Route path="/campaigns/:id/edit" element={<CampaignCreate />} />
          <Route path="/campaigns/:id/report" element={<CampaignReport />} />
          <Route path="/subscribers" element={<Subscribers />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/templates/new" element={<TemplateEditor />} />
          <Route path="/templates/:id/edit" element={<TemplateEditor />} />
          <Route path="/settings" element={<SettingsGuard />} />
        </Route>
      </Routes>
    </RoleProvider>
  );
}
