import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import {
  Plus,
  RotateCcw,
  Search,
  X,
  FileCheck2,
  FileText,
  Layers,
} from "lucide-react";
import NewsHeader from "../components/NewsHeader";
import NewsList from "../components/NewsList";
import PageState from "../components/PageState";
import { deleteNews, getAllNews } from "../services/newsService";
import {
  confirmDelete,
  showError,
  showSuccess,
} from "../services/alertService";

const CATEGORIES = ["การศึกษา", "เทคโนโลยี", "สังคม"];

const NewsPage = () => {
  const navigate = useNavigate();
  const [allNews, setAllNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // State สำหรับค้นหาและกรอง
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ทั้งหมด");

  const loadAllNews = useCallback(async (searchQuery, categoryFilter) => {
    setLoading(true);
    setError("");
    try {
      const data = await getAllNews({
        search: searchQuery,
        category: categoryFilter,
      });
      setAllNews(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isCancelled = false;
    const fetchInitialNews = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAllNews({ search: "", category: "ทั้งหมด" });
        if (!isCancelled) {
          setAllNews(data || []);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err.message);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialNews();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAllNews(search, category);
  };

  const handleCategorySelect = (selectedCat) => {
    setCategory(selectedCat);
    loadAllNews(search, selectedCat);
  };

  const handleReset = () => {
    setSearch("");
    setCategory("ทั้งหมด");
    loadAllNews("", "ทั้งหมด");
  };

  const handleDelete = async (id) => {
    if (!(await confirmDelete())) return;
    try {
      await deleteNews(id);
      setAllNews((currentNews) =>
        currentNews.filter((news) => news.id !== id)
      );
      showSuccess("ลบข่าวสำเร็จ");
    } catch (err) {
      showError(err);
    }
  };

  const isFiltered = search.trim() !== "" || category !== "ทั้งหมด";

  // คำนวณสรุปสถิติเบื้องต้น
  const publishedCount = allNews.filter(
    (n) =>
      n.status === true ||
      n.status === "true" ||
      n.status === 1 ||
      n.status === "1" ||
      n.status === "เผยแพร่"
  ).length;
  const draftCount = allNews.length - publishedCount;

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-5">
        {/* Header สวยงาม เรียบหรู */}
        <NewsHeader />

        {/* แถบสรุปภาพรวม (Overview Stats) ขนาดพอเหมาะ ดูเป็นมืออาชีพ */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-2xl border border-base-200/80 bg-base-100 p-3.5 shadow-xs">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Layers className="size-5" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">
                {isFiltered ? "พบในเงื่อนไข" : "ข่าวทั้งหมด"}
              </p>
              <p className="text-lg font-semibold text-base-content">
                {allNews.length}{" "}
                <span className="text-xs font-normal text-base-content/50">
                  รายการ
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-base-200/80 bg-base-100 p-3.5 shadow-xs">
            <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <FileCheck2 className="size-5" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">เผยแพร่แล้ว</p>
              <p className="text-lg font-semibold text-base-content">
                {publishedCount}{" "}
                <span className="text-xs font-normal text-base-content/50">
                  รายการ
                </span>
              </p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 rounded-2xl border border-base-200/80 bg-base-100 p-3.5 shadow-xs sm:col-span-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <FileText className="size-5" />
            </div>
            <div>
              <p className="text-xs text-base-content/60">ฉบับร่าง</p>
              <p className="text-lg font-semibold text-base-content">
                {draftCount}{" "}
                <span className="text-xs font-normal text-base-content/50">
                  รายการ
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* แผงค้นหาและตัวกรองหมวดหมู่ */}
        <section className="rounded-2xl border border-base-200/80 bg-base-100 p-4 shadow-xs sm:p-5">
          <div className="space-y-3.5">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              {/* ฟอร์มค้นหาคำในหัวข้อข่าว */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-1 flex-col gap-2.5 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <input
                    type="text"
                    className="input input-bordered w-full rounded-xl pl-9.5 pr-8 text-sm focus:border-primary focus:outline-none"
                    placeholder="ค้นหาชื่อหรือหัวข้อข่าว..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        loadAllNews("", category);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1 text-base-content/40 hover:bg-base-200 hover:text-base-content"
                      title="ล้างข้อความค้นหา"
                    >
                      <X className="size-3.5" />
                    </button>
                  )}
                </div>

                {/* Dropdown กรองหมวดหมู่ (สำหรับหน้าจอทั่วไป/มือถือ) */}
                <div className="w-full sm:w-44">
                  <select
                    className="select select-bordered w-full rounded-xl text-sm"
                    value={category}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                  >
                    <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-xl px-4 text-sm font-medium shadow-xs"
                  >
                    <Search className="size-4" />
                    <span>ค้นหา</span>
                  </button>

                  {isFiltered && (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="btn btn-ghost rounded-xl px-3 text-xs text-error/80 hover:bg-error/10 hover:text-error"
                      title="ล้างเงื่อนไขทั้งหมด"
                    >
                      <RotateCcw className="size-3.5" />
                      <span className="hidden sm:inline">ล้างเงื่อนไข</span>
                    </button>
                  )}
                </div>
              </form>

              {/* ปุ่มเพิ่มข่าวใหม่ */}
              <div className="border-t border-base-200/80 pt-3 lg:border-t-0 lg:pt-0">
                <Link
                  className="btn btn-primary w-full rounded-xl text-sm font-medium shadow-xs sm:w-auto"
                  to="/news/new"
                >
                  <Plus className="size-4" />
                  <span>เพิ่มข่าวใหม่</span>
                </Link>
              </div>
            </div>

            {/* Quick Filter Pills สำหรับเลือกหมวดหมู่อย่างรวดเร็ว */}
            <div className="flex flex-wrap items-center gap-1.5 border-t border-base-200/70 pt-3 text-xs">
              <span className="mr-1 text-base-content/50">ตัวกรองด่วน:</span>
              <button
                type="button"
                onClick={() => handleCategorySelect("ทั้งหมด")}
                className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                  category === "ทั้งหมด"
                    ? "bg-primary text-primary-content shadow-xs"
                    : "bg-base-200/70 text-base-content/70 hover:bg-base-200 hover:text-base-content"
                }`}
              >
                ทั้งหมด
              </button>
              {CATEGORIES.map((cat) => {
                const isActive = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-content shadow-xs"
                        : "bg-base-200/70 text-base-content/70 hover:bg-base-200 hover:text-base-content"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* แสดงสถานะ Loading หรือ Error */}
        <PageState loading={loading} error={error} />

        {/* แสดงรายการข่าวเมื่อโหลดเสร็จและไม่มี Error */}
        {!loading && !error && (
          <NewsList
            newsAll={allNews}
            onEdit={(news) => navigate(`/news/${news.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
};

export default NewsPage;