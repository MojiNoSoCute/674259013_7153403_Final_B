import { AlertCircle, Loader2 } from "lucide-react";

function PageState({ loading, error }) {
  if (loading) {
    return (
      <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-2xl border border-base-200/80 bg-base-100 p-8 shadow-xs">
        <Loader2 className="size-6 animate-spin text-primary" />
        <span className="text-xs font-medium text-base-content/60">
          กำลังโหลดข้อมูล...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-error/30 bg-error/10 p-4 text-error"
      >
        <AlertCircle className="size-5 shrink-0" />
        <div className="text-xs sm:text-sm">
          <p className="font-semibold">เกิดข้อผิดพลาด</p>
          <p className="mt-0.5 opacity-90">{error}</p>
        </div>
      </div>
    );
  }

  return null;
}

export default PageState;