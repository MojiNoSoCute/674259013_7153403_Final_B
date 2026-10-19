import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  Calendar,
  Pencil,
  Trash2,
  User,
} from "lucide-react";
import NewsHeader from "../components/NewsHeader";
import PageState from "../components/PageState";
import { deleteNews, getNews } from "../services/newsService";
import { confirmDelete, showError, showSuccess } from "../services/alertService";

function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    const fetchNewsDetail = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getNews(id);
        if (!isCancelled) {
          setNews(data);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message || "ไม่สามารถโหลดข้อมูลข่าวได้");
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchNewsDetail();

    return () => {
      isCancelled = true;
    };
  }, [id]);

  const handleDelete = async () => {
    if (!(await confirmDelete())) return;
    try {
      await deleteNews(id);
      showSuccess("ลบข่าวสำเร็จ");
      navigate("/news");
    } catch (err) {
      showError(err);
    }
  };

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

  const isPublished =
    news?.status === true ||
    news?.status === "true" ||
    news?.status === 1 ||
    news?.status === "1" ||
    news?.status === "เผยแพร่";

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-4">
        <NewsHeader />

        {/* แถบนำทาง Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-base-content/60">
          <Link
            to="/news"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>กลับสู่รายการข่าว</span>
          </Link>
          <span className="text-base-content/30">/</span>
          <span className="truncate font-medium text-base-content/90">
            {news?.title || `ข่าว #${id}`}
          </span>
        </div>

        <PageState loading={loading} error={error} />

        {!loading && !error && news && (
          <article className="rounded-3xl border border-base-200/90 bg-base-100 p-6 shadow-xs sm:p-8">
            {/* หมวดหมู่ และ สถานะ */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-base-200/70 pb-4">
              <div className="flex items-center gap-2">
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
              </div>

              <span className="font-mono text-xs text-base-content/40">
                รหัสข่าว ID #{news.id}
              </span>
            </div>

            {/* หัวข้อข่าว */}
            <h1 className="mt-5 text-xl font-bold leading-snug text-base-content sm:text-3xl">
              {news.title}
            </h1>

            {/* ผู้รายงาน และ วันที่เผยแพร่ */}
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl bg-base-200/50 px-4 py-3 text-xs text-base-content/75 sm:text-sm">
              <div className="flex items-center gap-1.5">
                <User className="size-4 text-primary" />
                <span>
                  ผู้รายงาน:{" "}
                  <strong className="font-medium text-base-content">
                    {news.reporter || "-"}
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-4 text-primary" />
                <span>วันที่เผยแพร่: {formatDate(news.publishedDate)}</span>
              </div>
            </div>

            {/* รายละเอียดเนื้อหาข่าว */}
            <div className="mt-6 border-t border-base-200/70 pt-6">
              <h2 className="mb-3 text-xs font-semibold tracking-wider text-base-content/50 uppercase">
                เนื้อหาข่าวสาร
              </h2>
              <div className="text-sm leading-relaxed text-base-content/85 whitespace-pre-line sm:text-base">
                {news.description}
              </div>
            </div>

            {/* แถบปุ่มจัดการ */}
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-base-200/80 pt-5">
              <Link
                to="/news"
                className="btn btn-ghost btn-sm gap-1.5 rounded-xl text-xs font-normal text-base-content/70 hover:bg-base-200"
              >
                <ArrowLeft className="size-3.5" />
                <span>กลับหน้ารวมข่าว</span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to={`/news/${news.id}/edit`}
                  className="btn btn-primary btn-sm gap-1.5 rounded-xl text-xs font-medium shadow-xs"
                >
                  <Pencil className="size-3.5" />
                  <span>แก้ไขข่าวนี้</span>
                </Link>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="btn btn-ghost btn-sm gap-1.5 rounded-xl text-xs font-normal text-error hover:bg-error/10"
                >
                  <Trash2 className="size-3.5" />
                  <span>ลบข่าว</span>
                </button>
              </div>
            </div>
          </article>
        )}
      </div>
    </main>
  );
}

export default NewsDetailPage;
