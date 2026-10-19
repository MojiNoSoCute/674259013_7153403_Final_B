import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import PageState from "../components/PageState.jsx";
import NewsForm from "../components/NewsForm.jsx";
import NewsHeader from "../components/NewsHeader.jsx";
import { showError, showSuccess } from "../services/alertService.js";
import { createNews, getNews, updateNews } from "../services/newsService.js";

const getTodayDate = () => new Date().toISOString().split("T")[0];

function NewsFormPage({ isEditing = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState("");
  const [category, setCategory] = useState("การศึกษา");
  const [publishedDate, setPublishedDate] = useState(getTodayDate);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    let isCancelled = false;
    const loadNews = async () => {
      try {
        const news = await getNews(id);
        if (isCancelled) return;
        setTitle(news.title || "");
        setReporter(news.reporter || "");
        setCategory(news.category || "การศึกษา");
        setPublishedDate(
          news.publishedDate
            ? news.publishedDate.split("T")[0]
            : getTodayDate()
        );
        setDescription(news.description || "");
        setStatus(Boolean(news.status));
      } catch (requestError) {
        if (!isCancelled) {
          setError(requestError.message);
          showError(requestError);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadNews();

    return () => {
      isCancelled = true;
    };
  }, [id, isEditing]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !title.trim() ||
      !reporter.trim() ||
      !category.trim() ||
      !description.trim() ||
      status === undefined
    ) {
      showError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    setIsSubmitting(true);
    try {
      const news = {
        title: title.trim(),
        reporter: reporter.trim(),
        category: category.trim(),
        publishedDate: publishedDate || getTodayDate(),
        description: description.trim(),
        status: Boolean(status),
      };

      if (isEditing) {
        await updateNews(id, news);
      } else {
        await createNews(news);
      }

      await showSuccess(isEditing ? "แก้ไขข่าวสำเร็จ" : "เพิ่มข่าวสำเร็จ");
      navigate("/news");
    } catch (requestError) {
      showError(requestError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        {/* ส่วนหัว Header */}
        <NewsHeader />

        {/* Breadcrumb ย้อนกลับ */}
        <div className="flex items-center gap-1.5 text-xs text-base-content/60">
          <Link
            to="/news"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <ArrowLeft className="size-3.5" />
            <span>กลับสู่รายการข่าว</span>
          </Link>
          <span className="text-base-content/30">/</span>
          <span className="font-medium text-base-content/90">
            {isEditing ? `แก้ไขข่าว #${id}` : "เพิ่มข่าวใหม่"}
          </span>
        </div>

        {/* แสดงสถานะ Loading หรือ Error */}
        <PageState loading={loading} error={error} />

        {/* ฟอร์มกรอกข้อมูลข่าว */}
        {!loading && !error && (
          <NewsForm
            editingId={isEditing ? id : null}
            title={title}
            reporter={reporter}
            category={category}
            publishedDate={publishedDate}
            description={description}
            status={status}
            isSubmitting={isSubmitting}
            onTitleChange={setTitle}
            onReporterChange={setReporter}
            onCategoryChange={setCategory}
            onPublishedDateChange={setPublishedDate}
            onDescriptionChange={setDescription}
            onStatusChange={setStatus}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/news")}
          />
        )}
      </div>
    </main>
  );
}

export default NewsFormPage;