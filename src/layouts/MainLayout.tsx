import { Outlet, NavLink } from "react-router-dom";
import {
  Braces,
  FileJson,
  FileCode,
  CodeXml,
  Coffee,
  Hash,
} from "lucide-react";
import { cn } from "../lib/utils";

const MainLayout = () => {
  // Mapping of language IDs to Icons
  const navItems = [
    { id: "json", name: "JSON", icon: FileJson, path: "/format/json" },
    { id: "xml", name: "XML", icon: CodeXml, path: "/format/xml" },
    { id: "java", name: "Java", icon: Coffee, path: "/format/java" },
    { id: "csharp", name: "CSharp", icon: Hash, path: "/format/csharp" },
    { id: "c", name: "C", icon: FileCode, path: "/format/c" },
    { id: "cpp", name: "C++", icon: FileCode, path: "/format/cpp" },
  ];

  // isActive removed as NavLink handles it internally via callback

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-16 flex flex-col items-center py-4 border-r border-border bg-card/50 backdrop-blur-sm z-50">
        <div className="mb-8">
          <Braces className="w-8 h-8 text-primary" />
        </div>

        <nav className="flex-1 w-full flex flex-col items-center gap-4 px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 group relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="absolute left-14 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border pointer-events-none z-50">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header Area (Optional, minimal) */}
        {/* <header className="h-12 border-b flex items-center px-6 bg-card/30">
              <span className="text-sm font-medium text-muted-foreground">Format > {navItems.find(i => isActive(i.path))?.name}</span>
          </header> */}

        <main className="flex-1 overflow-hidden p-0 relative">
          <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
