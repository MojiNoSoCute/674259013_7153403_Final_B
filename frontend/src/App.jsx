import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import NewsPage from "./pages/NewsPage";
import AddNewsPage from "./pages/AddNewsPage";
import EditNewsPage from "./pages/EditNewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/news" replace />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/news/new" element={<AddNewsPage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        <Route path="/news/:id/edit" element={<EditNewsPage />} />
        <Route path="*" element={<Navigate to="/news" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;