import { useState } from "react";
import { Calendar, Eye, Newspaper, Pencil, Trash2, User } from "lucide-react";
import NewsDetailModal from "./NewsDetailModal";

const NewsList = ({ newsAll = [], onEdit, onDelete }) => {
  const [selectedNews, setSelectedNews] = useState(null);

  if (!newsAll || newsAll.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-base-300 bg-base-100/60 p-12 text-center shadow-xs">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-base-200/80 text-base-content/40">
          <Newspaper className="size-7" />
        </div>
        <h3 className="mt-3.5 text-base font-semibold text-base-content">
          ไม่พบรายการข่าว
        </h3>
        <p className="mt-1 text-xs text-base-content/60 sm:text-sm">
          ยังไม่มีข้อมูลข่าวสารในเงื่อนไขที่เลือก หรือยังไม่มีข่าวในระบบ
        </p>
      </div>
    );
  }

  // กำหนดสีและหน้าตาของหมวดหมู่ให้ดูนุ่มนวล เป็นธรรมชาติ
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

  const formatStatus = (status) => {
    const isPublished =
      status === true ||
      status === "true" ||
      status === 1 ||
      status === "1" ||
      status === "เผยแพร่";

    return {
      isPublished,
      label: isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง",
      className: isPublished
        ? "bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
        : "bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800/50",
      dotClass: isPublished ? "bg-emerald-500" : "bg-amber-500",
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("th-TH", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <section className="space-y-4">
      {/* ส่วนหัวแสดงจำนวนรายการข่าว */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold text-base-content sm:text-lg">
            รายการข่าวทั้งหมด
          </h2>
          <span className="rounded-full bg-base-200 px-2.5 py-0.5 text-xs font-medium text-base-content/70">
            {newsAll.length}
          </span>
        </div>
      </div>

      {/* Grid การ์ดข่าวสาร */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {newsAll.map((news) => {
          const statusInfo = formatStatus(news.status);
          const catClass = getCategoryBadgeClass(news.category);

          return (
            <article
              key={news.id}
              className="group flex flex-col justify-between rounded-2xl border border-base-200/90 bg-base-100 p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md"
            >
              {/* ส่วนคลิกเพื่อดูรายละเอียดข่าว */}
              <div
                className="cursor-pointer"
                onClick={() => setSelectedNews(news)}
                title="คลิกเพื่อดูรายละเอียดข่าว"
              >
                {/* แถบหมวดหมู่ และ สถานะ */}
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${catClass}`}
                  >
                    {news.category || "ทั่วไป"}
                  </span>

                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}
                  >
                    <span
                      className={`size-1.5 rounded-full ${statusInfo.dotClass}`}
                    />
                    {statusInfo.label}
                  </span>
                </div>

                {/* รหัสและหัวข้อข่าว */}
                <div className="mt-3">
                  <span className="font-mono text-[11px] font-medium text-base-content/40">
                    ID #{news.id}
                  </span>
                  <h3
                    className="mt-1 line-clamp-2 text-base font-semibold text-base-content transition-colors group-hover:text-primary sm:text-lg"
                    title={news.title}
                  >
                    {news.title}
                  </h3>
                </div>

                {/* รายละเอียดเนื้อหา */}
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-base-content/65 sm:text-sm">
                  {news.description || "ไม่มีรายละเอียดเนื้อหา"}
                </p>
              </div>

              <div>
                {/* ผู้รายงาน และ วันที่ */}
                <div className="mt-4 space-y-1.5 border-t border-base-200/70 pt-3 text-xs text-base-content/65">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="size-3.5 shrink-0 text-base-content/40" />
                    <span className="truncate">
                      ผู้รายงาน:{" "}
                      <strong className="font-medium text-base-content/80">
                        {news.reporter || "-"}
                      </strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="size-3.5 shrink-0 text-base-content/40" />
                    <span>วันที่เผยแพร่: {formatDate(news.publishedDate)}</span>
                  </div>
                </div>

                {/* ปุ่มจัดการข่าว: ดูรายละเอียด, แก้ไข, ลบ */}
                <div className="mt-4 flex items-center justify-between border-t border-base-200/70 pt-3">
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs gap-1 rounded-lg text-xs font-normal text-primary hover:bg-primary/10"
                    onClick={() => setSelectedNews(news)}
                    aria-label={`ดูรายละเอียดข่าว ${news.title}`}
                  >
                    <Eye className="size-3.5" />
                    <span>ดูข่าว</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs gap-1 rounded-lg text-xs font-normal text-base-content/75 hover:bg-primary/10 hover:text-primary"
                      onClick={() => onEdit(news)}
                      aria-label={`แก้ไขข่าว ${news.title}`}
                    >
                      <Pencil className="size-3.5" />
                      <span>แก้ไข</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs gap-1 rounded-lg text-xs font-normal text-error/80 hover:bg-error/10 hover:text-error"
                      onClick={() => onDelete(news.id)}
                      aria-label={`ลบข่าว ${news.title}`}
                    >
                      <Trash2 className="size-3.5" />
                      <span>ลบ</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal แสดงรายละเอียดข่าว */}
      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </section>
  );
};

export default NewsList;