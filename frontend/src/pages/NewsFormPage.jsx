import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import PageState from "../components/PageState.jsx";
import NewsForm from "../components/NewsForm.jsx";
import NewsHeader from "../components/NewsHeader.jsx";
import { showError, showSuccess } from "../services/alertService.js";
import { createNews, getNews, updateNews } from "../services/newsService.js";

function NewsFormPage({ isEditing = false }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const today = new Date().toISOString().split("T")[0];

  const [title, setTitle] = useState("");
  const [reporter, setReporter] = useState("");
  const [category, setCategory] = useState("การศึกษา");
  const [publishedDate, setPublishedDate] = useState(today);
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState(true);
  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isEditing) return;

    const loadNews = async () => {
      try {
        const news = await getNews(id);
        setTitle(news.title || "");
        setReporter(news.reporter || "");
        setCategory(news.category || "การศึกษา");
        setPublishedDate(
          news.publishedDate ? news.publishedDate.split("T")[0] : today
        );
        setDescription(news.description || "");
        setStatus(Boolean(news.status));
      } catch (requestError) {
        setError(requestError.message);
        showError(requestError);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
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
        publishedDate: publishedDate || today,
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
      <div className="mx-auto max-w-6xl space-y-6">
        <NewsHeader />
        <PageState loading={loading} error={error} />
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