import { useState, useEffect, useMemo } from "react";

export function usePagination(
  items: any[],
  itemsPerPage: number,
  search: string
) {
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница

  useEffect(() => {
    setCurrentPage(1); // Сброс на первую страницу при изменении поиска
  }, [search, itemsPerPage]); // Добавляем itemsPerPage в зависимости

  const totalPages = Math.ceil(items.length / itemsPerPage); // Общее число страниц

  const currentItems = useMemo(() => { // Элементы для текущей страницы
    const startIndex = (currentPage - 1) * itemsPerPage; // Начальный индекс
    const endIndex = startIndex + itemsPerPage; // Конечный индекс
    return items.slice(startIndex, endIndex); // Возвращаем срез массива
  }, [items, currentPage, itemsPerPage]); // Зависимости

  const showingFrom = items.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0; // Первый показываемый элемент
  const showingTo = Math.min(currentPage * itemsPerPage, items.length); // Последний показываемый элемент

  return {
    currentPage,
    setCurrentPage,
    totalPages,
    currentItems,
    showingFrom,
    showingTo,
  };
}