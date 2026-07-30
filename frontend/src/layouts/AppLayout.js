import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "./AppLayout.css";

export default function AppLayout({ user }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-layout__main">
        <Header user={user} />
        <main className="app-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
