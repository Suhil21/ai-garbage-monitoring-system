import { Link, useLocation } from "react-router-dom";
import { Shield, LayoutDashboard, Upload, MapPin, UserCheck, Brain } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "Report", icon: Upload },
  { to: "/map", label: "Map View", icon: MapPin },
  { to: "/officers", label: "Officers", icon: UserCheck },
  { to: "/model", label: "Model Info", icon: Brain },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-primary text-primary-foreground">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-lg">
          <div className="flex items-center justify-center h-9 w-9 rounded-full bg-primary-foreground/20">
            <Shield className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="block text-sm font-bold tracking-wide">CleanCity AI</span>
            <span className="block text-[10px] font-normal opacity-80 tracking-wider uppercase">Smart Garbage Monitoring System</span>
          </div>
        </Link>

        <nav className="flex items-center gap-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                pathname === to
                  ? "bg-primary-foreground/20 text-primary-foreground"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden lg:inline">{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
