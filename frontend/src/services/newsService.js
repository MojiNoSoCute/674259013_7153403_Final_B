const API_URL = `${import.meta.env.VITE_API_URL}/api/news`;

const request = async (url, option) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
  return response.json();
};

const getAllNews = (params = {}) => {
  const query = new URLSearchParams();
  if (params.search && params.search.trim() !== "") {
    query.append("search", params.search.trim());
  }
  if (params.category && params.category !== "ทั้งหมด") {
    query.append("category", params.category.trim());
  }

  const queryString = query.toString();
  return request(`${API_URL}${queryString ? `?${queryString}` : ""}`);
};

const getNews = (id) => request(`${API_URL}/${id}`);

const getNewsCategory = (category) => request(`${API_URL}/category/${category}`);

const createNews = (news) =>
  request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(news),
  });

const updateNews = (id, news) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(news),
  });

const deleteNews = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });

export {
  getAllNews,
  getNews,
  getNewsCategory,
  createNews,
  updateNews,
  deleteNews,
};