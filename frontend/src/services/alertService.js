import Swal from "sweetalert2";

const getErrorMessage = (error) => {
  if (typeof error === "string") return error;

  try {
    const response = JSON.parse(error.message);
    return response.error || response.message || error.message;
  } catch {
    return error?.message || "เกิดข้อผิดพลาดในการทำรายการ";
  }
};

const showError = (error) =>
  Swal.fire({
    icon: "error",
    title: "เกิดข้อผิดพลาด",
    text: getErrorMessage(error),
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#3b82f6",
  });

const showSuccess = (title, text) =>
  Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1500,
    showConfirmButton: false,
  });

const confirmDelete = () =>
  Swal.fire({
    icon: "warning",
    title: "ยืนยันการลบข่าวสาร",
    text: "คุณแน่ใจหรือไม่ว่าต้องการลบรายการข่าวนี้? การกระทำนี้ไม่สามารถย้อนกลับได้",
    showCancelButton: true,
    confirmButtonText: "ยืนยันการลบ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    reverseButtons: true,
  }).then((result) => result.isConfirmed);

export { confirmDelete, showError, showSuccess };
