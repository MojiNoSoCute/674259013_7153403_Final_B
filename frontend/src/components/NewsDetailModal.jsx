import { useEffect } from "react";
import { Link } from "react-router";
import {
  Calendar,
  ExternalLink,
  Pencil,
  Trash2,
  User,
  X,
} from "lucide-react";

function NewsDetailModal({ news, onClose, onEdit, onDelete }) {
  // ปิด modal ด้วยปุ่ม Escape
  useEffect(() => {
    if (!news) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [news, onClose]);

  if (!news) return null;

  const isPublished =
    news.status === true ||
    news.status === "true" ||
    news.status === 1 ||
    news.status === "1" ||
    news.status === "เผยแพร่";

  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case "การศึกษา":
        return "bg-sky-50 text-sky-700 border-sky-200/80 dark:bg-sky-950/40 dark:text-sky-300 dark:border-sky-800/50";
      case "เทคโนโลยี":
        return "bg-indigo-50 text-indigo-700 border-indigo-200/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50";
      case "สังคม":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50";
      default:
        return "bg-base-200 text-base-content/80 border-base-300";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("th-TH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs transition-opacity"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-base-200/90 bg-base-100 p-6 shadow-2xl sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* แถบด้านบน: หมวดหมู่, สถานะ, รหัสข่าว และปุ่มปิด */}
        <div className="flex items-center justify-between gap-3 border-b border-base-200/70 pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${getCategoryBadgeClass(
                news.category
              )}`}
            >
              {news.category || "ทั่วไป"}
            </span>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                isPublished
                  ? "border-emerald-200/80 bg-emerald-50 text-emerald-700 dark:border-emerald-800/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-amber-200/80 bg-amber-50 text-amber-700 dark:border-amber-800/50 dark:bg-amber-950/40 dark:text-amber-300"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isPublished ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง"}
            </span>

            <span className="font-mono text-xs text-base-content/40">
              ID #{news.id}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-base-content/40 transition-colors hover:bg-base-200 hover:text-base-content"
            aria-label="ปิดหน้าต่าง"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* หัวข้อข่าว */}
        <div className="mt-4">
          <h2 className="text-lg font-bold leading-snug text-base-content sm:text-2xl">
            {news.title}
          </h2>
        </div>

        {/* แถบข้อมูลผู้เขียนและวันที่ */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl bg-base-200/50 px-3.5 py-2.5 text-xs text-base-content/75">
          <div className="flex items-center gap-1.5">
            <User className="size-3.5 text-primary" />
            <span>
              ผู้รายงาน:{" "}
              <strong className="font-medium text-base-content">
                {news.reporter || "-"}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="size-3.5 text-primary" />
            <span>วันที่เผยแพร่: {formatDate(news.publishedDate)}</span>
          </div>
        </div>

        {/* เนื้อหาข่าวแบบเต็ม */}
        <div className="mt-5 border-t border-base-200/70 pt-4">
          <h3 className="mb-2 text-xs font-semibold tracking-wide text-base-content/50 uppercase">
            รายละเอียดเนื้อหา
          </h3>
          <p className="text-sm leading-relaxed text-base-content/85 whitespace-pre-line sm:text-base">
            {news.description || "ไม่มีรายละเอียดเนื้อหาข่าว"}
          </p>
        </div>

        {/* แถบปุ่ม Action ด้านล่าง */}
        <div className="mt-7 flex flex-wrap items-center justify-between gap-2.5 border-t border-base-200/80 pt-4">
          <Link
            to={`/news/${news.id}`}
            className="flex items-center gap-1 text-xs text-base-content/60 transition-colors hover:text-primary"
            onClick={onClose}
          >
            <ExternalLink className="size-3.5" />
            <span>เปิดดูแบบเต็มหน้า</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="btn btn-ghost btn-sm gap-1.5 rounded-xl text-xs font-normal text-base-content/75 hover:bg-primary/10 hover:text-primary"
              onClick={() => {
                onClose();
                onEdit(news);
              }}
            >
              <Pencil className="size-3.5" />
              <span>แก้ไขข่าว</span>
            </button>

            <button
              type="button"
              className="btn btn-ghost btn-sm gap-1.5 rounded-xl text-xs font-normal text-error hover:bg-error/10"
              onClick={() => {
                onClose();
                onDelete(news.id);
              }}
            >
              <Trash2 className="size-3.5" />
              <span>ลบ</span>
            </button>

            <button
              type="button"
              className="btn btn-neutral btn-sm rounded-xl px-4 text-xs font-medium"
              onClick={onClose}
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsDetailModal;
