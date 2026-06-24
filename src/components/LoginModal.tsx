import { Modal, Button, Form } from "react-bootstrap";

type Props = {
  show: boolean;
  onClose: () => void;
  username: string;
  setUsername: (username: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  setError: (err: string) => void;
  onLoginSuccess: (role: 0 | 1, fullName: string, token: string) => void; // Изменено
};

export default function LoginModal({
  show,
  onClose,
  username,
  setUsername,
  password,
  setPassword,
  error,
  setError,
  onLoginSuccess,
}: Props) {
  const handleLogin = async () => {
    try {
      // Убедитесь, что порт правильный (5207 или 5000)
      const res = await fetch(`http://localhost:5207/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Ошибка входа");
      }

      const data = await res.json();
      onLoginSuccess(data.role, data.fullName, data.token);
      setError("");

      alert(`Вы успешно вошли в систему, ${data.fullName}!`);

      onClose();
    } catch (err: any) {
      setError(err.message || "Ошибка входа");
    }
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Вход</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          className="mb-3"
          placeholder="Логин"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Form.Control
          type="password"
          className="mb-3"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div className="text-danger mb-3">{error}</div>}
        <Button variant="primary" className="w-100" onClick={handleLogin}>
          Войти
        </Button>
      </Modal.Body>
    </Modal>
  );
}
