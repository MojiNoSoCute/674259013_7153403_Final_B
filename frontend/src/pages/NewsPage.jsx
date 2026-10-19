import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, RotateCcw, Search } from "lucide-react";
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

  const loadAllNews = async (
    searchQuery = search,
    categoryFilter = category
  ) => {
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
  };

  useEffect(() => {
    loadAllNews("", "ทั้งหมด");
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadAllNews(search, category);
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

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <NewsHeader />

        {/* กล่องค้นหาและกรองหมวดหมู่ พร้อมปุ่มเพิ่มข่าว */}
        <section className="card border border-base-300 bg-base-100 p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* ฟอร์มค้นหาและกรองข้อมูล ส่งประมวลผลที่ Backend ผ่าน Query Parameters */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center"
            >
              {/* ช่องค้นหาคำค้นบางส่วนจากชื่อข่าว */}
              <div className="relative flex-1">
                <input
                  type="text"
                  className="input input-bordered w-full pl-10"
                  placeholder="ค้นหาชื่อหรือหัวข้อข่าว..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-base-content/40" />
              </div>

              {/* กรองหมวดหมู่ (การศึกษา, เทคโนโลยี, สังคม) */}
              <div className="w-full sm:w-48">
                <select
                  className="select select-bordered w-full"
                  value={category}
                  onChange={(e) => {
                    const newCategory = e.target.value;
                    setCategory(newCategory);
                    loadAllNews(search, newCategory);
                  }}
                >
                  <option value="ทั้งหมด">หมวดหมู่ทั้งหมด</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* ปุ่มค้นหา */}
              <button type="submit" className="btn btn-primary">
                <Search className="size-4" /> ค้นหา
              </button>

              {/* ปุ่มล้างเงื่อนไข (กลับมาแสดงรายการทั้งหมด) */}
              {isFiltered && (
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn btn-ghost text-error hover:bg-error/10"
                >
                  <RotateCcw className="size-4" /> ล้างเงื่อนไข
                </button>
              )}
            </form>

            {/* ปุ่มเพิ่มข่าว */}
            <div className="flex justify-end border-t border-base-200 pt-3 lg:border-t-0 lg:pt-0">
              <Link className="btn btn-primary w-full sm:w-auto" to="/news/new">
                <Plus className="size-4" /> เพิ่มข่าวใหม่
              </Link>
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