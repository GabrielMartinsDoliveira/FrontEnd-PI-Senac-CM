import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EvidencePOST, HeaderReq, UserByIdGET } from "../../api/PathsApi";
import "./RegisterEvidence.css";
import { goToCaseDetails } from "../../router/Coordinator";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

const RegisterEvidence = () => {
  const { idCaso } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dataColeta: new Date().toISOString().split("T")[0],
      coletadoPor: "",
    },
  });

  const [nomeColetor, setNomeColetor] = useState("Carregando...");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupTimeout, setPopupTimeout] = useState(null);
  const navigate = useNavigate();

  const getUserEvidence = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setValue("coletadoPor", response.data._id);
      setNomeColetor(response.data.nome);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
      setNomeColetor("Erro ao carregar usuário");
      setValue("coletadoPor", "error");
    }
  };

  const handleClosePopup = () => {
    if (popupTimeout) {
      clearTimeout(popupTimeout);
    }
    setShowPopup(false);
    goToCaseDetails(navigate, idCaso);
  };

  const onSubmit = async (data) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(`${EvidencePOST}`, data, {
        headers: HeaderReq(token),
      });
      console.log("Evidência criada com sucesso", response.data);
      setShowPopup(true);

      const timeout = setTimeout(() => {
        handleClosePopup();
      }, 3000);
      setPopupTimeout(timeout);
    } catch (error) {
      console.error("Erro ao criar evidência: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    getUserEvidence();
    setValue("idCaso", idCaso);

    return () => {
      if (popupTimeout) {
        clearTimeout(popupTimeout);
      }
    };
  }, [setValue, idCaso]);

  return (
    <>
      <form className="form-evidence" onSubmit={handleSubmit(onSubmit)}>
      <h2>Cadastrar Evidência</h2>
        <div>
          <label htmlFor="idCaso">ID do Caso</label>
          <input
            type="hidden"
            id="idCaso"
            {...register("idCaso", { required: "Campo obrigatório" })}
          />
          {errors.idCaso && <p>{errors.idCaso.message}</p>}
        </div>

        <div>
          <label htmlFor="tipo">Tipo</label>
          <input
            id="tipo"
            {...register("tipo", { required: "Campo obrigatório" })}
          />
          {errors.tipo && <p>{errors.tipo.message}</p>}
        </div>

        <div>
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            {...register("descricao", { required: "Campo obrigatório" })}
          />
          {errors.descricao && <p>{errors.descricao.message}</p>}
        </div>

        <div>
          <label htmlFor="dataColeta">Data da Coleta</label>
          <input
            id="dataColeta"
            type="date"
            {...register("dataColeta", { required: "Campo obrigatório" })}
          />
          {errors.dataColeta && <p>{errors.dataColeta.message}</p>}
        </div>

        <div>
          <label htmlFor="coletadoPor">Coletado Por</label>
          <input
            value={nomeColetor}
            disabled
            {...register("coletadoPorDisplay")}
          />
          <input type="hidden" {...register("coletadoPor")} />
        </div>
        <div>
          <label htmlFor="latitude">Latitude</label>
          <input
            id="latitude"
            type="number"
            step="any"
            {...register("localColeta.latitude")}
          />
        </div>

        <div>
          <label htmlFor="longitude">Longitude</label>
          <input
            id="longitude"
            type="number"
            step="any"
            {...register("localColeta.longitude")}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : "Salvar Evidência"}
        </button>
        <button
          onClick={() => {
            goToCaseDetails(navigate, idCaso);
          }}
        >
          Voltar
        </button>
        {showPopup && (
          <div className="popup-overlay">
            <PopUpConfirm entityName="Evidência" />
            <button
              onClick={handleClosePopup}
              className="popup-close-button"
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "transparent",
                border: "none",
                fontSize: "1.5rem",
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        )}
      </form>
    </>
  );
};

export default RegisterEvidence;
