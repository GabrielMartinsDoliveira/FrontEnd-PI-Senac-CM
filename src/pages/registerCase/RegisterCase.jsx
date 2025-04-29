import { useForm } from "react-hook-form";
import axios from "axios";
import { CasePOST, HeaderReq, UserByIdGET } from "../../api/PathsApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { goToCases } from "../../router/Coordinator";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

const RegisterCase = () => {
  const [userCase, setUserCase] = useState(null);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimeout, setPopupTimeout] = useState(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const handleClosePopup = () => {
    if (popupTimeout) clearTimeout(popupTimeout);
    setShowPopup(false);
    goToCases(navigate);
  };

  const onSubmit = async (data) => {
    try {
      await axios.post(CasePOST, data, {
        headers: HeaderReq(token),
      });
      setShowPopup(true);
      const timeout = setTimeout(() => handleClosePopup(), 3000);
      setPopupTimeout(timeout);
    } catch (error) {
      console.error("Erro ao criar caso:", error);
    }
  };

  const getUserCase = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setUserCase(response.data);
      setValue("responsavel", response.data._id);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  useEffect(() => {
    getUserCase();
    const hoje = new Date().toISOString().split("T")[0];
    setValue("dataAbertura", hoje);

    return () => {
      if (popupTimeout) clearTimeout(popupTimeout);
    };
  }, [setValue, userId]);

  return (
    <div
      className="container"
      style={{
        marginTop: "12vh",
        marginLeft: "12vw",
        padding: "20px",
        minHeight: "88vh",
        backgroundColor: "#dee1eb",
        border: "solid 1px",
      }}
    >
      <h1 className="text-center mb-4">Criar Novo Caso</h1>

      <form className="row g-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-md-6">
          <label htmlFor="responsavel" className="form-label">
            Responsável
          </label>
          <select
            id="responsavel"
            className="form-select"
            disabled
            {...register("responsavel", { required: true })}
          >
            {userCase ? (
              <option value={userCase._id}>{userCase.nome || "Usuário"}</option>
            ) : (
              <option value="">Carregando responsável...</option>
            )}
          </select>
          {errors.responsavel && (
            <div className="text-danger">Responsável é obrigatório.</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="status" className="form-label">
            Status
          </label>
          <select
            id="status"
            className="form-select"
            {...register("status", { required: true })}
          >
            <option value="">Selecione um Status</option>
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Arquivado">Arquivado</option>
          </select>
          {errors.status && (
            <div className="text-danger">Status é obrigatório.</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="titulo" className="form-label">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            className="form-control"
            {...register("titulo", { required: "Título é obrigatório" })}
          />
          {errors.titulo && (
            <div className="text-danger">{errors.titulo.message}</div>
          )}
        </div>

        <div className="col-md-6">
          <label htmlFor="dataAbertura" className="form-label">
            Data de Abertura
          </label>
          <input
            type="date"
            id="dataAbertura"
            className="form-control"
            readOnly
            {...register("dataAbertura", { required: true })}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="dataOcorrencia" className="form-label">
            Data Ocorrência
          </label>
          <input
            type="date"
            id="dataOcorrencia"
            className="form-control"
            {...register("dataOcorrencia", { required: true })}
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="dataFechamento" className="form-label">
            Data de Fechamento
          </label>
          <input
            type="date"
            id="dataFechamento"
            className="form-control"
            disabled
            {...register("dataFechamento")}
          />
        </div>

        <div className="col-12">
          <label htmlFor="descricao" className="form-label">
            Descrição
          </label>
          <textarea
            id="descricao"
            className="form-control"
            rows="5"
            {...register("descricao", { required: "Descrição é obrigatória" })}
          ></textarea>
          {errors.descricao && (
            <div className="text-danger">{errors.descricao.message}</div>
          )}
        </div>

        <div className="col-12 d-flex justify-content-center gap-4">
          <button
            type="submit"
            className="btn btn-success"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enviando..." : "Criar Caso"}
          </button>
          <button
            onClick={() => goToCases(navigate)}
            className="btn btn-secondary"
          >
            Voltar
          </button>
        </div>
      </form>

      {showPopup && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-50">
          <div className="position-relative">
            <PopUpConfirm entityName="Caso" />
            <button
              onClick={handleClosePopup}
              className="btn btn-close position-absolute top-0 end-0 m-2"
            ></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterCase;
