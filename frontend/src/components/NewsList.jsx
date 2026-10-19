import { Calendar, Newspaper, Pencil, Trash2, User } from "lucide-react";

const NewsList = ({ newsAll = [], onEdit, onDelete }) => {
  if (!newsAll || newsAll.length === 0) {
    return (
      <div className="card border border-dashed border-base-300 bg-base-100 shadow-sm">
        <div className="card-body items-center py-14 text-center">
          <Newspaper className="size-12 text-base-content/25" />
          <h2 className="card-title mt-2">ยังไม่มีข้อมูลข่าว</h2>
          <p className="text-sm text-base-content/60">
            เริ่มต้นด้วยการเพิ่มข่าวใหม่ด้านบน
          </p>
        </div>
      </div>
    );
  }

  const formatStatus = (status) => {
    const isPublished =
      status === true ||
      status === "true" ||
      status === 1 ||
      status === "1" ||
      status === "เผยแพร่";
    return {
      label: isPublished ? "เผยแพร่แล้ว" : "ฉบับร่าง",
      className: isPublished
        ? "badge-success text-white"
        : "badge-ghost text-base-content/70",
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
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">รายการข่าวทั้งหมด</h2>
          <p className="text-sm text-base-content/60">
            มีข่าวทั้งหมด {newsAll.length} รายการ
          </p>
        </div>
        <span className="badge badge-primary badge-lg">{newsAll.length}</span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {newsAll.map((news) => {
          const statusInfo = formatStatus(news.status);

          return (
            <article
              className="card border border-base-300 bg-base-100 shadow-sm transition-shadow hover:shadow-md"
              key={news.id}
            >
              <div className="card-body gap-3 p-5">
                {/* หมวดหมู่ และ สถานะ */}
                <div className="flex items-center justify-between gap-2">
                  <span className="badge badge-outline badge-primary text-xs">
                    {news.category || "ทั่วไป"}
                  </span>
                  <span className={`badge text-xs font-medium ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* หัวข้อข่าว */}
                <div>
                  <p className="font-mono text-xs text-base-content/50">
                    #{news.id}
                  </p>
                  <h3
                    className="mt-1 line-clamp-2 text-lg font-bold text-base-content"
                    title={news.title}
                  >
                    {news.title}
                  </h3>
                </div>

                {/* รายละเอียดข่าว */}
                <p className="line-clamp-3 min-h-12 text-sm text-base-content/70">
                  {news.description || "ไม่มีรายละเอียดข่าว"}
                </p>

                {/* ผู้รายงาน และ วันที่เผยแพร่ */}
                <div className="flex flex-col gap-1.5 border-t border-base-200 pt-3 text-xs text-base-content/65">
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="size-3.5 shrink-0 text-primary" />
                    <span>
                      ผู้รายงาน: <strong>{news.reporter || "-"}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate">
                    <Calendar className="size-3.5 shrink-0 text-primary" />
                    <span>วันที่: {formatDate(news.publishedDate)}</span>
                  </div>
                </div>

                {/* ปุ่ม Action */}
                <div className="card-actions justify-end border-t border-base-200 pt-3">
                  <button
                    className="btn btn-ghost btn-sm text-primary hover:bg-primary/10"
                    onClick={() => onEdit(news)}
                    aria-label={`แก้ไขข่าว ${news.title}`}
                  >
                    <Pencil className="size-4" /> แก้ไข
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-error hover:bg-error/10"
                    onClick={() => onDelete(news.id)}
                    aria-label={`ลบข่าว ${news.title}`}
                  >
                    <Trash2 className="size-4" /> ลบ
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default NewsList;