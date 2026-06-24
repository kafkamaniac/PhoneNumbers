import { Pagination } from "react-bootstrap";
import "./PaginationControls.css"; 

type PaginationControlsProps = { 
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
};

export default function PaginationControls({ // Компонент управления пагинацией
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 5, // Максимальное число видимых страниц
}: PaginationControlsProps) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => { // Обработка изменения страницы
    if (page < 1 || page > totalPages) return; // Проверка границ
    onPageChange(page); // Вызов колбэка
    window.scrollTo({ top: 0, behavior: "smooth" }); // Прокрутка вверх
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Страница {currentPage} из {totalPages}
      </div>

      <Pagination className="pagination-controls">
        <Pagination.First
          onClick={() => handlePageChange(1)}
          disabled={currentPage === 1}
        />
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />

        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <Pagination.Ellipsis key={`ellipsis-${index}`} disabled />
          ) : (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => handlePageChange(page as number)}
            >
              {page}
            </Pagination.Item>
          )
        )}

        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
        <Pagination.Last
          onClick={() => handlePageChange(totalPages)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </div>
  );
}
