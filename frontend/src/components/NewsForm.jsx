import { Pencil, PlusCircle, X } from "lucide-react";

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
  // จัดการแปลงค่าวันที่สำหรับ input type="date" (ให้อยู่ในฟอร์แมต YYYY-MM-DD)
  const formattedDate = publishedDate
    ? typeof publishedDate === "string" && publishedDate.includes("T")
      ? publishedDate.split("T")[0]
      : publishedDate
    : "";

  return (
    <section className="card border border-base-300 bg-base-100 shadow-sm">
      <div className="card-body p-5 sm:p-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <PlusCircle className="size-5" />
          </div>
          <div>
            <h2 className="card-title text-xl">
              {editingId ? "แก้ไขข่าว" : "เพิ่มข่าวใหม่"}
            </h2>
            <p className="text-sm text-base-content/60">
              {editingId
                ? "แก้ไขข้อมูลข่าวในระบบ"
                : "กรอกข้อมูลเพื่อเพิ่มรายการข่าวเข้าสู่ระบบ"}
            </p>
          </div>
        </div>
        <form
          className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2"
          onSubmit={onSubmit}
        >
          {/* ชื่อข่าว */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">ชื่อข่าว</span>
            <input
              className="input input-bordered w-full"
              type="text"
              value={title || ""}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="เช่น รายงานสภาพอากาศประจำวัน"
              required
            />
          </label>

          {/* ผู้รายงาน */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">ผู้รายงาน</span>
            <input
              className="input input-bordered w-full"
              type="text"
              value={reporter || ""}
              onChange={(event) => onReporterChange(event.target.value)}
              placeholder="เช่น สมชาย ใจดี หรือ สำนักข่าวไทย"
              required
            />
          </label>

          {/* หมวดหมู่ (จำกัดเฉพาะ การศึกษา, เทคโนโลยี, สังคม) */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">หมวดหมู่</span>
            <select
              className="select select-bordered w-full"
              value={category || "การศึกษา"}
              onChange={(event) => onCategoryChange(event.target.value)}
              required
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </label>

          {/* วันที่เผยแพร่ */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">วันที่เผยแพร่</span>
            <input
              className="input input-bordered w-full"
              type="date"
              value={formattedDate}
              onChange={(event) => onPublishedDateChange(event.target.value)}
              required
            />
          </label>

          {/* สถานะ */}
          <label className="form-control w-full">
            <span className="label-text mb-2 font-medium">สถานะ</span>
            <select
              className="select select-bordered w-full"
              value={status === true || status === "true" ? "true" : "false"}
              onChange={(event) =>
                onStatusChange(event.target.value === "true")
              }
            >
              <option value="true">เผยแพร่ (Published)</option>
              <option value="false">ฉบับร่าง (Draft)</option>
            </select>
          </label>

          {/* ช่องว่างเพื่อให้ layout สวยงามบน desktop */}
          <div className="hidden md:block" />

          {/* รายละเอียดข่าว */}
          <label className="form-control w-full md:col-span-2">
            <span className="label-text mb-2 font-medium">รายละเอียดข่าว</span>
            <textarea
              className="textarea textarea-bordered w-full"
              value={description || ""}
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="กรอกรายละเอียดเนื้อหาข่าวเพิ่มเติม..."
              rows="4"
              required
            />
          </label>

          {/* ปุ่ม Submit และ Cancel */}
          <div className="flex flex-col gap-2 md:col-span-2 md:flex-row md:justify-end">
            <button
              className="btn btn-primary w-full md:w-auto"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="loading loading-spinner loading-sm" />
              ) : editingId ? (
                <Pencil className="size-4" />
              ) : (
                <PlusCircle className="size-4" />
              )}
              {isSubmitting
                ? "กำลังบันทึก..."
                : editingId
                  ? "บันทึกการแก้ไข"
                  : "บันทึกข้อมูล"}
            </button>
            <button
              className="btn btn-ghost w-full md:w-auto"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              <X className="size-4" /> ยกเลิก
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default NewsForm;
