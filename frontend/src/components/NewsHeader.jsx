import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Newspaper, Sun, Moon, Calendar, Plus, Home } from "lucide-react";

const NewsHeader = () => {
  const location = useLocation();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("news_theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("news_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const isFormPage =
    location.pathname.includes("/new") || location.pathname.includes("/edit");

  // วันที่ปัจจุบันภาษาไทย
  const todayFormatted = new Intl.DateTimeFormat("th-TH", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date());

  return (
    <header className="rounded-2xl border border-base-200/80 bg-base-100 p-4 shadow-sm transition-all sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* โลโก้ และ ชื่อระบบ */}
        <div className="flex items-center gap-3.5">
          <Link
            to="/news"
            className="group flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-200 hover:bg-primary hover:text-primary-content"
            title="กลับไปหน้าหลัก"
          >
            <Newspaper className="size-6 transition-transform group-hover:scale-105" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to="/news"
                className="text-lg font-semibold tracking-tight text-base-content hover:text-primary sm:text-xl"
              >
                ระบบจัดการข่าวสาร
              </Link>
              <span className="hidden rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary sm:inline-block">
                News Portal
              </span>
            </div>
            <p className="text-xs text-base-content/60 sm:text-sm">
              ศูนย์รวบรวมและบริหารข้อมูลข่าวสารประชาสัมพันธ์
            </p>
          </div>
        </div>

        {/* แถบเครื่องมือขวา: วันที่, ปุ่มธีม, ปุ่มลัด */}
        <div className="flex items-center justify-between gap-2.5 border-t border-base-200/80 pt-3 sm:border-t-0 sm:pt-0">
          {/* วันที่ปัจจุบัน */}
          <div className="flex items-center gap-1.5 rounded-lg bg-base-200/60 px-2.5 py-1.5 text-xs text-base-content/70">
            <Calendar className="size-3.5 text-base-content/50" />
            <span>{todayFormatted}</span>
          </div>

          <div className="flex items-center gap-2">
            {/* สลับหน้า Home / เพิ่มข่าว */}
            {isFormPage ? (
              <Link
                to="/news"
                className="btn btn-ghost btn-sm gap-1.5 text-xs font-normal"
              >
                <Home className="size-3.5" />
                <span className="hidden sm:inline">หน้ารายการข่าว</span>
              </Link>
            ) : (
              <Link
                to="/news/new"
                className="btn btn-primary btn-sm gap-1.5 text-xs font-medium shadow-xs"
              >
                <Plus className="size-3.5" />
                <span>เพิ่มข่าว</span>
              </Link>
            )}

            {/* ปุ่มสลับ Light / Dark Mode */}
            <button
              type="button"
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content"
              title={`เปลี่ยนเป็นธีม ${theme === "light" ? "Dark" : "Light"}`}
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="size-4" />
              ) : (
                <Sun className="size-4 text-warning" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default NewsHeader;