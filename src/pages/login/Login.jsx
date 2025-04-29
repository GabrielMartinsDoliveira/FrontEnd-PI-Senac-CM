import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LoginPOST } from "../../api/PathsApi";
import "./Login.css";
import { goToHome } from "../../router/Coordinator";
import logo from "../../assets/imgs/ForenSeek2 1.png";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  if (token) {
    goToHome(navigate);
  }

  const onSubmit = async (data) => {
    try {
      clearErrors();
      const response = await axios.post(LoginPOST, {
        matricula: data.matricula,
        senha: data.senha,
      });

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.user.id);
        navigate("/home");
      }
    } catch (err) {
      if (err.response) {
        setFormError("root", {
          type: "server",
          message: err.response.data.message || "Credenciais inválidas",
        });
      } else {
        setFormError("root", {
          type: "server",
          message: "Erro ao conectar com o servidor",
        });
      }
      console.error("Erro no login:", err);
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <div className="login-box">
          <img src={logo} alt="Logo do aplicativo ForenSeek" />

          {errors.root && (
            <div className="login-error-message" role="alert">
              {errors.root.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <div className="form-group">
              <label htmlFor="matricula">Matrícula</label>
              <input
                id="matricula"
                type="text"
                placeholder="Digite sua matrícula"
                {...register("matricula", {
                  required: "Matrícula é obrigatória",
                })}
                className={`login-input ${
                  errors.matricula ? "input-error" : ""
                }`}
              />
              {errors.matricula && (
                <span className="error-text">{errors.matricula.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="senha">Senha</label>
              <input
                id="senha"
                type="password"
                placeholder="Digite sua senha"
                {...register("senha", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "Senha deve ter pelo menos 6 caracteres",
                  },
                })}
                className={`login-input ${errors.senha ? "input-error" : ""}`}
              />
              {errors.senha && (
                <span className="error-text">{errors.senha.message}</span>
              )}
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Processando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
