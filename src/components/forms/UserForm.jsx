import React from "react";
import { useForm } from "react-hook-form";

const roles = ["admin", "perito", "assistente"];

const UserForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "80vh",
        marginTop: "12vh",
        marginLeft: "12vw ",
        paddingTop: "8vh",
        paddingLeft: "2vw",
        backgroundColor: "#dee1eb",
        border: "2px solid #0000009d",
        width: "84vw"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8 col-md-10">
            <form
              className="bg-white p-4 rounded shadow"
              onSubmit={handleSubmit(onSubmit)}
            >
              <h2 className="text-center mb-4">Cadastro de Usuário</h2>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Nome:</label>
                  <input
                    {...register("nome", { required: "Nome é obrigatório" })}
                    type="text"
                    className="form-control"
                  />
                  {errors.nome && (
                    <p className="text-danger small">{errors.nome.message}</p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Email:</label>
                  <input
                    {...register("email", {
                      required: "Email é obrigatório",
                      pattern: {
                        value: /^\S+@\S+$/,
                        message: "Email inválido",
                      },
                    })}
                    type="email"
                    className="form-control"
                  />
                  {errors.email && (
                    <p className="text-danger small">{errors.email.message}</p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Matrícula:</label>
                  <input
                    {...register("matricula", {
                      required: "Matrícula é obrigatória",
                    })}
                    type="text"
                    className="form-control"
                  />
                  {errors.matricula && (
                    <p className="text-danger small">
                      {errors.matricula.message}
                    </p>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label>Senha:</label>
                  <input
                    {...register("senha", {
                      required: "Senha é obrigatória",
                      minLength: {
                        value: 6,
                        message: "Mínimo de 6 caracteres",
                      },
                    })}
                    type="password"
                    className="form-control"
                  />
                  {errors.senha && (
                    <p className="text-danger small">{errors.senha.message}</p>
                  )}
                </div>

                <div className="col-md-6 mb-4">
                  <label>Role:</label>
                  <select
                    {...register("role", { required: "Role é obrigatória" })}
                    className="form-select"
                  >
                    <option value="">Selecione...</option>
                    {roles.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.role && (
                    <p className="text-danger small">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="text-center">
                <button type="submit" className="btn btn-success w-50">
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;
