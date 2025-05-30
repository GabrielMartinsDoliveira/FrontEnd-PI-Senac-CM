import React, { useState } from "react";
import axios from "axios";
import { HeaderReq, UserPUT } from "../../api/PathsApi";
import { useNavigate } from "react-router-dom";
import { goToHome } from "../../router/Coordinator";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

const UpdateUser = () => {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const displayPopUp = () => {
    return <PopUpConfirm entityName="Usuário" />;
  };

  const returnHome = () => {
    displayPopUp();
    setTimeout(() => {
      navigate(-1);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (senha !== confirmacao) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await axios.put(
        `${UserPUT}/${userId}`,
        { senha },
        { headers: HeaderReq(token) }
      );
      setMessage("Senha atualizada com sucesso!");
      setSenha("");
      setConfirmacao("");
      returnHome();
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao atualizar senha";
      setError(msg);
    }
  };

  return (
    <div
      className="container"
      style={{
        minHeight: "88vh",
        marginTop: "12vh",
        marginLeft: "12vw",
        paddingTop: "8vh",

        backgroundColor: "#dee1eb",
        border: "1px solid #0000009d",
        minWidth: "60vw",
      }}
    >
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div
              className="card-body "
              style={{ minHeight: "100%"}}
            >
              <h4 className="card-title text-center mb-4">Atualizar Senha</h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nova Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label">Confirmar Senha</label>
                  <input
                    type="password"
                    className="form-control"
                    value={confirmacao}
                    onChange={(e) => setConfirmacao(e.target.value)}
                    required
                  />
                </div>
                <div class="d-flex gap-5">
                  <button type="submit" className="btn btn-primary w-50 gap-2">
                    Atualizar Senha
                  </button>
                  <button
                    onClick={() => goToHome(navigate)}
                    className="btn btn-primary w-25"
                  >
                    Voltar
                  </button>
                </div>
              </form>

              {message && (
                <div className="alert alert-success mt-3 text-center">
                  {message}
                </div>
              )}
              {error && (
                <div className="alert alert-danger mt-3 text-center">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
