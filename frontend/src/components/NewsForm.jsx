import {
  Calendar,
  CheckCircle2,
  FileEdit,
  FolderOpen,
  Pencil,
  PlusCircle,
  Save,
  User,
  X,
} from "lucide-react";

const CATEGORIES = ["การศึกษา", "เทคโนโลยี", "สังคม"];

function NewsForm({
  editingId,
  title,
  reporter,
  category,
  publishedDate,
  description,
  status,
  isSubmitting,
  onTitleChange,
  onReporterChange,
  onCategoryChange,
  onPublishedDateChange,
  onDescriptionChange,
  onStatusChange,
  onSubmit,
  onCancel,
}) {
  // แปลงค่าวันที่สำหรับ input type="date" (ให้อยู่ในฟอร์แมต YYYY-MM-DD)
  const formattedDate = publishedDate
    ? typeof publishedDate === "string" && publishedDate.includes("T")
      ? publishedDate.split("T")[0]
      : publishedDate
    : "";

  const isPublished = status === true || status === "true";

  return (
    <section className="rounded-2xl border border-base-200/90 bg-base-100 p-5 shadow-xs sm:p-7">
      {/* ส่วนหัวของฟอร์ม */}
      <div className="flex items-center justify-between border-b border-base-200/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {editingId ? (
              <FileEdit className="size-5" />
            ) : (
              <PlusCircle className="size-5" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-base-content sm:text-xl">
              {editingId ? "แก้ไขข้อมูลข่าว" : "เพิ่มข่าวใหม่"}
            </h2>
            <p className="text-xs text-base-content/60 sm:text-sm">
              {editingId
                ? `แก้ไขรายละเอียดข่าวสาร ID #${editingId}`
                : "กรอกข้อมูลเพื่อเผยแพร่หรือบันทึกข่าวสารในระบบ"}
            </p>
          </div>
        </div>

        <span
          className={`hidden rounded-full px-3 py-1 text-xs font-medium sm:inline-block ${
            editingId
              ? "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
              : "bg-primary/10 text-primary"
          }`}
        >
          {editingId ? "โหมดแก้ไข" : "สร้างรายการใหม่"}
        </span>
      </div>

      <form onSubmit={onSubmit} className="mt-6 space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* 1. ชื่อข่าว */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-base-content/80 sm:text-sm">
              หัวข้อข่าว / ชื่อข่าว <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full rounded-xl text-sm focus:border-primary focus:outline-none"
              placeholder="เช่น ประกาศรับสมัครทุนการศึกษาประจำปี 2569"
              value={title || ""}
              onChange={(e) => onTitleChange(e.target.value)}
              required
            />
          </div>

          {/* 2. ผู้รายงาน */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 sm:text-sm">
              <User className="size-3.5 text-base-content/50" />
              <span>ผู้รายงาน / สำนักข่าว</span>
              <span className="text-error">*</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full rounded-xl text-sm focus:border-primary focus:outline-none"
              placeholder="เช่น สมชาย ใจดี หรือ งานประชาสัมพันธ์"
              value={reporter || ""}
              onChange={(e) => onReporterChange(e.target.value)}
              required
            />
          </div>

          {/* 3. หมวดหมู่ */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 sm:text-sm">
              <FolderOpen className="size-3.5 text-base-content/50" />
              <span>หมวดหมู่ข่าว</span>
              <span className="text-error">*</span>
            </label>
            <select
              className="select select-bordered w-full rounded-xl text-sm"
              value={category || "การศึกษา"}
              onChange={(e) => onCategoryChange(e.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 4. วันที่เผยแพร่ */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 sm:text-sm">
              <Calendar className="size-3.5 text-base-content/50" />
              <span>วันที่เผยแพร่</span>
              <span className="text-error">*</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full rounded-xl text-sm focus:border-primary focus:outline-none"
              value={formattedDate}
              onChange={(e) => onPublishedDateChange(e.target.value)}
              required
            />
          </div>

          {/* 5. สถานะข่าว (เลือกได้ง่าย ชัดเจน ไม่กำกวม) */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium text-base-content/80 sm:text-sm">
              <CheckCircle2 className="size-3.5 text-base-content/50" />
              <span>สถานะการแสดงผล</span>
            </label>
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              <button
                type="button"
                onClick={() => onStatusChange(true)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                  isPublished
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700 shadow-xs dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "border-base-200 bg-base-100 text-base-content/70 hover:bg-base-200/50"
                }`}
              >
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>เผยแพร่ (Published)</span>
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(false)}
                className={`flex items-center justify-center gap-2 rounded-xl border p-2.5 text-xs font-medium transition-all ${
                  !isPublished
                    ? "border-amber-500 bg-amber-50 text-amber-700 shadow-xs dark:bg-amber-950/40 dark:text-amber-300"
                    : "border-base-200 bg-base-100 text-base-content/70 hover:bg-base-200/50"
                }`}
              >
                <span className="size-2 rounded-full bg-amber-500" />
                <span>ฉบับร่าง (Draft)</span>
              </button>
            </div>
          </div>

          {/* 6. รายละเอียดข่าว */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-xs font-medium text-base-content/80 sm:text-sm">
              เนื้อหา / รายละเอียดข่าว <span className="text-error">*</span>
            </label>
            <textarea
              className="textarea textarea-bordered min-h-32 w-full rounded-xl text-sm leading-relaxed focus:border-primary focus:outline-none"
              placeholder="กรอกเนื้อหารายละเอียดของข่าวประชาสัมพันธ์อย่างครบถ้วน..."
              value={description || ""}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows="5"
              required
            />
          </div>
        </div>

        {/* แถบปุ่มบันทึกและยกเลิก */}
        <div className="flex flex-col-reverse gap-2.5 border-t border-base-200/80 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="btn btn-ghost rounded-xl text-xs font-medium text-base-content/70 hover:bg-base-200 sm:text-sm"
          >
            <X className="size-4" />
            <span>ยกเลิก</span>
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary rounded-xl px-5 text-xs font-medium shadow-xs sm:text-sm"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-xs" />
            ) : editingId ? (
              <Pencil className="size-4" />
            ) : (
              <Save className="size-4" />
            )}
            <span>
              {isSubmitting
                ? "กำลังบันทึกข้อมูล..."
                : editingId
                  ? "บันทึกการแก้ไข"
                  : "บันทึกข่าว"}
            </span>
          </button>
        </div>
      </form>
    </section>
  );
}

export default NewsForm;
