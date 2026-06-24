import { Modal, Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { Contact } from "./types";

type Props = {
  show: boolean;
  contact: Contact | null; // null = создание нового
  mode: "edit" | "add"; // Режим: редактирование или добавление
  onClose: () => void;
  onSave: (contact: Contact) => void;
  onAdd?: (contact: Omit<Contact, "id">) => void; // Для добавления
};

export default function ContactModal({
  show,
  contact,
  mode,
  onClose,
  onSave,
  onAdd,
}: Props) {
  // Для редактирования используем Contact, для добавления - без id
  const [formData, setFormData] = useState<Contact | Omit<Contact, "id">>({
    fullName: "",
    position: "",
    department: "",
    building: "",
    officeNumber: "",
    internalPhone: "",
    cityPhone: "",
    mobilePhone: "",
    email: "",
    login: "",
    password: "",
    role: 0,
    // Добавляем id только если редактируем существующий контакт
    ...(mode === "edit" && contact ? { id: contact.id } : {}),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Сбрасываем форму при открытии/закрытии модалки
  useEffect(() => {
    if (mode === "edit" && contact) {
      // Для редактирования: заполняем все поля из контакта
      setFormData({
        ...contact,
        password: "", // Не показываем текущий пароль при редактировании
      });
    } else if (mode === "add") {
      // Для добавления: пустая форма
      setFormData({
        fullName: "",
        position: "",
        department: "",
        building: "",
        officeNumber: "",
        internalPhone: "",
        cityPhone: "",
        mobilePhone: "",
        email: "",
        login: "",
        password: "",
        role: 0,
      });
    }
    setErrors({});
  }, [contact, mode, show]);

  const handleChange = (
    field: keyof (Contact | Omit<Contact, "id">),
    value: string | number
  ) => {
    setFormData({ ...formData, [field]: value });
    // Очищаем ошибку при изменении поля
    if (errors[field as string]) {
      const newErrors = { ...errors };
      delete newErrors[field as string];
      setErrors(newErrors);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Обязательные поля для любого режима
    if (!formData.fullName?.trim()) newErrors.fullName = "ФИО обязательно";
    if (!formData.email?.trim()) newErrors.email = "Email обязателен";

    // Дополнительные проверки для режима добавления
    if (mode === "add") {
      if (!formData.login?.trim()) newErrors.login = "Логин обязателен";
      if (!formData.password?.trim()) newErrors.password = "Пароль обязателен";
      if (formData.password && formData.password.length < 6) {
        newErrors.password = "Пароль должен быть не менее 6 символов";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    if (mode === "edit" && "id" in formData) {
      // Для редактирования: отправляем как Contact
      onSave(formData as Contact);
    } else if (mode === "add" && onAdd) {
      // Для добавления: отправляем без id
      onAdd(formData as Omit<Contact, "id">);
    }
  };

  const title =
    mode === "edit" ? "Редактирование контакта" : "Добавление нового контакта";

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>ФИО *</Form.Label>
                <Form.Control
                  value={formData.fullName || ""}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  isInvalid={!!errors.fullName}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.fullName}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Должность</Form.Label>
                <Form.Control
                  value={formData.position || ""}
                  onChange={(e) => handleChange("position", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Отдел</Form.Label>
                <Form.Control
                  value={formData.department || ""}
                  onChange={(e) => handleChange("department", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Здание</Form.Label>
                <Form.Control
                  value={formData.building || ""}
                  onChange={(e) => handleChange("building", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Номер офиса</Form.Label>
                <Form.Control
                  value={formData.officeNumber || ""}
                  onChange={(e) => handleChange("officeNumber", e.target.value)}
                />
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Внутренний телефон</Form.Label>
                <Form.Control
                  value={formData.internalPhone || ""}
                  onChange={(e) =>
                    handleChange("internalPhone", e.target.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Городской телефон</Form.Label>
                <Form.Control
                  value={formData.cityPhone || ""}
                  onChange={(e) => handleChange("cityPhone", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Мобильный телефон</Form.Label>
                <Form.Control
                  value={formData.mobilePhone || ""}
                  onChange={(e) => handleChange("mobilePhone", e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={formData.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              </Form.Group>

              {/* Поля логин, пароль и роль показываем только при добавлении */}
              {mode === "add" && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Логин *</Form.Label>
                    <Form.Control
                      value={formData.login || ""}
                      onChange={(e) => handleChange("login", e.target.value)}
                      isInvalid={!!errors.login}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.login}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Пароль *</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) => handleChange("password", e.target.value)}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Минимум 6 символов
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Роль</Form.Label>
                    <Form.Select
                      value={formData.role}
                      onChange={(e) =>
                        handleChange("role", parseInt(e.target.value))
                      }
                    >
                      <option value={0}>Обычный пользователь</option>
                      <option value={1}>Администратор</option>
                    </Form.Select>
                  </Form.Group>
                </>
              )}
            </div>
          </div>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Отмена
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {mode === "edit" ? "Сохранить изменения" : "Добавить контакт"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
