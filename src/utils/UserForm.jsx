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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Nome:</label>
        <input
          {...register("nome", { required: "Nome é obrigatório" })}
          type="text"
        />
        {errors.nome && <p>{errors.nome.message}</p>}
      </div>

      <div>
        <label>Email:</label>
        <input
          {...register("email", {
            required: "Email é obrigatório",
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Email inválido",
            },
          })}
          type="email"
        />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <label>Matrícula:</label>
        <input
          {...register("matricula", { required: "Matrícula é obrigatória" })}
          type="text"
        />
        {errors.matricula && <p>{errors.matricula.message}</p>}
      </div>

      <div>
        <label>Senha:</label>
        <input
          {...register("senha", {
            required: "Senha é obrigatória",
            minLength: { value: 6, message: "Mínimo de 6 caracteres" },
          })}
          type="password"
        />
        {errors.senha && <p>{errors.senha.message}</p>}
      </div>

      <div>
        <label>Role:</label>
        <select {...register("role", { required: "Role é obrigatória" })}>
          <option value="">Selecione...</option>
          {roles.map((role) => (
            <option key={role} value={role}>
              {role}
            </option>
          ))}
        </select>
        {errors.role && <p>{errors.role.message}</p>}
      </div>

      <button type="submit">Salvar</button>
    </form>
  );
};

export default UserForm;