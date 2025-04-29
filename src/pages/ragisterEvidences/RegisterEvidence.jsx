import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EvidencePOST, HeaderReq, UserByIdGET } from "../../api/PathsApi";
import { goToCaseDetails } from "../../router/Coordinator";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";
import { Modal } from "bootstrap";

const RegisterEvidence = () => {
  const { idCaso } = useParams();
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const modalRef = useRef(null);

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

  const onSubmit = async (data) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await axios.post(`${EvidencePOST}`, data, {
        headers: HeaderReq(token),
      });
      console.log("Evidência criada com sucesso");
      setShowPopup(true);
      const modal = new Modal(modalRef.current);
      modal.show();
    } catch (error) {
      console.error("Erro ao criar evidência: ", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    const modalInstance = Modal.getInstance(modalRef.current);
    modalInstance.hide();
    setShowPopup(false);
    goToCaseDetails(navigate, idCaso);
  };

  useEffect(() => {
    getUserEvidence();
    setValue("idCaso", idCaso);
  }, [setValue, idCaso]);

  return (
    <div
      className="container "
      style={{
        marginTop: "12vh",
        marginLeft: "12vw",
        padding: "20px",
        minHeight: "88vh",
        backgroundColor: "#dee1eb",
        border: "solid 1px",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center mb-4">Cadastrar Evidência</h2>

        {/* ID do Caso - oculto */}
        <input
          type="hidden"
          id="idCaso"
          {...register("idCaso", { required: "Campo obrigatório" })}
        />
        {errors.idCaso && (
          <p className="text-danger">{errors.idCaso.message}</p>
        )}

        <div className="mb-3">
          <label htmlFor="tipo" className="form-label">
            Tipo
          </label>
          <input
            id="tipo"
            className="form-control"
            {...register("tipo", { required: "Campo obrigatório" })}
          />
          {errors.tipo && <p className="text-danger">{errors.tipo.message}</p>}
        </div>

        <div className="mb-3">
          <label htmlFor="descricao" className="form-label">
            Descrição
          </label>
          <textarea
            id="descricao"
            className="form-control"
            rows={4}
            {...register("descricao", { required: "Campo obrigatório" })}
          />
          {errors.descricao && (
            <p className="text-danger">{errors.descricao.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="arquivos" className="form-label">
            Arquivo
          </label>
          <input
            id="arquivos"
            type="file"
            className="form-control"
            {...register("arquivos")}
          />
          {errors.arquivos && (
            <p className="text-danger">{errors.arquivos.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="dataColeta" className="form-label">
            Data da Coleta
          </label>
          <input
            id="dataColeta"
            type="date"
            className="form-control"
            {...register("dataColeta", { required: "Campo obrigatório" })}
          />
          {errors.dataColeta && (
            <p className="text-danger">{errors.dataColeta.message}</p>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="coletadoPor" className="form-label">
            Coletado Por
          </label>
          <input
            value={nomeColetor}
            disabled
            className="form-control"
            {...register("coletadoPorDisplay")}
          />
          <input type="hidden" {...register("coletadoPor")} />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="latitude" className="form-label">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              step="any"
              className="form-control"
              {...register("localColeta.latitude")}
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="longitude" className="form-label">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              step="any"
              className="form-control"
              {...register("localColeta.longitude")}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-success"
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Salvando...
              </>
            ) : (
              "Salvar Evidência"
            )}
          </button>

          <button
            type="button"
            onClick={() => goToCaseDetails(navigate, idCaso)}
            className="btn btn-secondary"
          >
            Voltar
          </button>
        </div>
      </form>

      <div className="modal fade" tabIndex="-1" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Sucesso!</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body text-center">
              <PopUpConfirm entityName="Evidência" />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCloseModal}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterEvidence;
