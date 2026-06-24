import { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { Contact } from "./types";
import "./ListOfContacts.css";
import { usePagination } from "./usePagination";
import PaginationControls from "./PaginationControls";

type Props = {
  contacts: Contact[];
  userRole: 0 | 1;
  onEditClick: (contact: Contact) => void;
  onAddClick?: () => void;
  onDeleteClick?: (id: number) => void;
};

// Доступные поля для поиска
const searchableFields = [
  { key: "all", label: "Все поля" },
  { key: "fullName", label: "ФИО" },
  { key: "position", label: "Должность" },
  { key: "department", label: "Подразделение" },
  { key: "internalPhone", label: "Внутренний телефон" },
  { key: "cityPhone", label: "Городской телефон" },
  { key: "mobilePhone", label: "Мобильный телефон" },
  { key: "email", label: "Email" },
];

export default function ListOfContacts({
  contacts,
  userRole,
  onEditClick,
  onAddClick,
  onDeleteClick,
}: Props) {
  const [search, setSearch] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchField, setSearchField] = useState<string>("all"); // По умолчанию поиск по всем полям

  // Фильтрация контактов в зависимости от выбранного поля
  const filteredContacts = contacts.filter((contact) => {
    if (!search.trim()) return true;

    const searchTerm = search.toLowerCase();

    if (searchField === "all") {
      // Поиск по всем полям
      return Object.values(contact).some((val) =>
        String(val).toLowerCase().includes(searchTerm)
      );
    } else {
      // Поиск по конкретному полю
      const fieldValue = contact[searchField as keyof Contact];
      return String(fieldValue).toLowerCase().includes(searchTerm);
    }
  });

  const pagination = usePagination(filteredContacts, itemsPerPage, search);

  return (
    <div>
      {/* Верхняя панель с поиском и информацией */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <div className="d-flex align-items-center mb-2" style={{ flex: 1 }}>
          {/* Выбор поля для поиска */}
          <select
            className="form-select me-2"
            style={{ width: "auto" }}
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            {searchableFields.map((field) => (
              <option key={field.key} value={field.key}>
                {field.label}
              </option>
            ))}
          </select>

          {/* Поле поиска */}
          <div className="input-group" style={{ maxWidth: "300px" }}>
            <input
              type="text"
              className="form-control"
              placeholder={`Поиск по ${searchableFields
                .find((f) => f.key === searchField)
                ?.label?.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={() => setSearch("")}
              >
                ✕
              </button>
            )}
          </div>

          {/* Информация о записях */}
          {filteredContacts.length > 0 && (
            <div className="records-info ms-3">
              Найдено: {filteredContacts.length} из {contacts.length}
            </div>
          )}
        </div>

        {/* Кнопка добавления (только для админов) */}
        {userRole === 1 && onAddClick && (
          <button className="btn btn-success mb-2" onClick={onAddClick}>
            <i className="bi bi-person-plus me-1"></i>
            Добавить
          </button>
        )}
      </div>
      {/* Таблица */}
      <Table bordered hover responsive className="custom-table">
        <thead className="custom-header">
          <tr>
            <th>ФИО</th>
            <th>Должность</th>
            <th>Подразделение</th>
            <th>Корпус</th>
            <th>Кабинет</th>
            <th>Внутр. тел.</th>
            <th>Городской</th>
            <th>Мобильный</th>
            <th>Email</th>
            {userRole === 1 && <th>Действия</th>}
          </tr>
        </thead>
        <tbody>
          {pagination.currentItems.length > 0 ? (
            pagination.currentItems.map((contact) => (
              <tr key={contact.id}>
                <td data-label="ФИО">{contact.fullName}</td>
                <td data-label="Должность">{contact.position}</td>
                <td data-label="Подразделение">{contact.department}</td>
                <td data-label="Корпус">{contact.building}</td>
                <td data-label="Кабинет">{contact.officeNumber}</td>
                <td data-label="Внутр. тел.">{contact.internalPhone}</td>
                <td data-label="Городской">{contact.cityPhone}</td>
                <td data-label="Мобильный">{contact.mobilePhone}</td>
                <td data-label="Email">{contact.email}</td>

                {userRole === 1 && (
                  <td data-label="Действия">
                    <div className="d-flex gap-2 mt-2 mt-md-0">
                      {" "}
                      {/* Добавь mt-2 для мобильных, mt-md-0 для десктопа */}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        onClick={() => onEditClick(contact)}
                      >
                        Редактировать
                      </Button>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() =>
                          onDeleteClick && onDeleteClick(contact.id)
                        }
                      >
                        Х
                      </Button>
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={userRole === 1 ? 10 : 9}
                className="text-center py-4"
              >
                {search ? "Ничего не найдено" : "Нет данных"}
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      {/* Пагинация */}
      <div className="pagination-container mt-3">
        <div className="items-per-page-selector">
          <span className="text-muted small me-2">Записей на странице:</span>
          <select
            className="form-select form-select-sm w-auto d-inline-block"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="pagination-center">
          <PaginationControls
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={pagination.setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
