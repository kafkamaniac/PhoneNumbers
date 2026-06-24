import { useState, useEffect } from "react";
import LoginModal from "./components/LoginModal";
import ContactModal from "./components/ContactModal";
import ListOfContacts from "./components/ListOfContacts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Contact } from "./components/types";

export default function AuthModals() {
  // Главный компонент приложения
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState<0 | 1>(0);
  const [editContact, setEditContact] = useState<Contact | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalMode, setModalMode] = useState<"edit" | "add">("edit");
  const [token, setToken] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  // Проверяем токен при загрузке
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
      const savedRole = localStorage.getItem("userRole");
      const savedName = localStorage.getItem("username");

      if (savedRole && savedName) {
        setUserRole(parseInt(savedRole) as 0 | 1);
        setUsername(savedName);
        setLoggedIn(true);
        loadContacts(savedToken);
      }
    }
  }, []);

  // Загрузка контактов с сервера
  const loadContacts = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5207/api/contacts", {
        // Убедитесь, что порт правильный
        headers: {
          Authorization: `Bearer ${authToken}`, // Добавляем токен в заголовки
          "Content-Type": "application/json", // Добавлено для явного указания типа контента
        },
      });

      if (!res.ok) {
        throw new Error(`Ошибка загрузки: ${res.status}`);
      }

      const data = await res.json(); // Ожидаем массив контактов
      setContacts(data); // Устанавливаем контакты в состояние
    } catch (err: any) {
      console.error("Ошибка загрузки контактов:", err);
      if (err.message.includes("401") || err.message.includes("403")) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const openLogin = () => setShowLogin(true); // Открыть модалку входа

  const handleLogout = () => {
    // Выход из системы
    setLoggedIn(false);
    setUsername("");
    setPassword("");
    setUserRole(0);
    setToken(null);
    setContacts([]);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("username");
  };

  const handleEditClick = (contact: Contact) => {
    // Редактирование контакта
    setModalMode("edit");
    setEditContact(contact);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (updatedContact: Contact) => {
    // Сохранение изменений контакта
    if (!token) {
      alert("Требуется авторизация");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5207/api/contacts/${updatedContact.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedContact),
        }
      );

      if (!res.ok) {
        throw new Error(`Ошибка при сохранении: ${res.status}`);
      }

      setContacts(
        (
          prev // Обновляем контакт в локальном состоянии
        ) => prev.map((c) => (c.id === updatedContact.id ? updatedContact : c))
      );
      setShowEditModal(false);
      alert("Контакт успешно обновлен");
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    }
  };

  // Добавление нового контакта
  const handleAddContact = async (newContact: Omit<Contact, "id">) => {
    if (!token) {
      alert("Требуется авторизация");
      return;
    }

    try {
      const res = await fetch("http://localhost:5207/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContact),
      });

      if (!res.ok) {
        throw new Error(`Ошибка при добавлении: ${res.status}`);
      }

      // Получаем созданный контакт с сервера
      const createdContact = await res.json();

      // Добавляем новый контакт в список
      setContacts((prev) => [...prev, createdContact]);
      setShowEditModal(false);

      alert("Контакт успешно добавлен!");
    } catch (err: any) {
      console.error("Ошибка при добавлении:", err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  // Удаление контакта
  const handleDeleteContact = async (contactId: number) => {
    if (!token) {
      alert("Требуется авторизация");
      return;
    }

    // Подтверждение удаления
    if (!window.confirm("Вы уверены, что хотите удалить этот контакт?")) {
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5207/api/contacts/${contactId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error(`Ошибка при удалении: ${res.status}`);
      }

      // Удаляем контакт из локального состояния
      setContacts((prev) => prev.filter((contact) => contact.id !== contactId));

      alert("Контакт успешно удален!");
    } catch (err: any) {
      console.error("Ошибка при удалении:", err);
      alert(`Ошибка: ${err.message}`);
    }
  };

  // Обработка успешного входа
  const handleLoginSuccess = async (
    role: 0 | 1,
    fullName: string,
    newToken: string
  ) => {
    setUserRole(role);
    setUsername(fullName);
    setToken(newToken);
    setLoggedIn(true);

    localStorage.setItem("token", newToken);
    localStorage.setItem("userRole", role.toString());
    localStorage.setItem("username", fullName);

    await loadContacts(newToken);
  };

  if (loggedIn) {
    return (
      <div className="container mt-4">
        {/* Заголовок и кнопка выхода */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="mb-0">Телефонный справочник</h1>
          <div>
            <span className="me-3">
              Добро пожаловать, <strong>{username}!</strong>
            </span>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
            <p className="mt-3">Загрузка контактов...</p>
          </div>
        ) : (
          //показываем список контактов
          <>
            <ListOfContacts
              contacts={contacts}
              userRole={userRole}
              onEditClick={handleEditClick}
              onAddClick={() => {
                setModalMode("add");
                setEditContact(null);
                setShowEditModal(true);
              }}
              onDeleteClick={handleDeleteContact} // Добавляем обработчик удаления
            />
            <ContactModal
              show={showEditModal}
              contact={editContact}
              mode={modalMode}
              onClose={() => setShowEditModal(false)}
              onSave={handleSaveEdit}
              onAdd={handleAddContact}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="mb-4">Телефонный справочник</h1>
        <button className="btn btn-primary btn-lg" onClick={openLogin}>
          Войти в систему
        </button>{" "}
        {/* Кнопка для открытия модалки входа */}
        <LoginModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={handleLoginSuccess}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
}
