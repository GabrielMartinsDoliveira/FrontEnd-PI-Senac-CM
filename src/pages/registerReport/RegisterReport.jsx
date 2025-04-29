import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CasesDetailsGET, HeaderReq, ReportPOST } from "../../api/PathsApi";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

const RegisterReport = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { idCaso } = useParams();
  const [caseInfo, setCaseInfo] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const token = localStorage.getItem("token");

  const onSubmit = async (data) => {
    try {
      const reportData = {
        ...data,
        dataCriacao: new Date(),
      };

      const response = await axios.post(`${ReportPOST}`, reportData, {
        headers: HeaderReq(token),
      });
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate(-1);
      }, 3000);
      console.log("Relatório criado:", response.data);
    } catch (error) {
      console.error("Erro ao criar relatório:", error);
    }
  };

  const getCaseInfo = async () => {
    try {
      const response = await axios(`${CasesDetailsGET}/${idCaso}`, {
        headers: HeaderReq(token),
      });
      setCaseInfo(response.data);
      setValue("peritoResponsavel", response.data?.responsavel._id);
      setValue("casoReportado", response.data?._id);
      console.log("Info do caso", response.data);
    } catch (error) {
      console.error("Erro ao recuperar o caso", error);
    }
  };

  useEffect(() => {
    getCaseInfo();
  }, []);

  return (
    <div
      className="container "
      style={{
        minHeight: "80vh",
        marginTop: "12vh",
        marginLeft: "12vw",
        paddingTop: "6vh",
        paddingLeft: "2vw",
        backgroundColor: "#dee1eb",
        border: "2px solid #0000009d",
        width: "80vw",
      }}
    >
      {showPopup && <PopUpConfirm entityName="Relatório" />}
      <div className="card shadow-sm">
        <div
          className="card-body"
          style={{ backgroundColor: "#dee1eb", border: "none" }}
        >
          <h1 className="card-title text-center mb-4">Criar Novo Relatório</h1>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label htmlFor="titulo" className="form-label">
                Título
              </label>
              <input
                id="titulo"
                type="text"
                className={`form-control ${errors.titulo ? "is-invalid" : ""}`}
                {...register("titulo", { required: "Título é obrigatório" })}
              />
              {errors.titulo && (
                <div className="invalid-feedback">{errors.titulo.message}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="conteudo" className="form-label">
                Conteúdo
              </label>
              <textarea
                id="conteudo"
                rows={6}
                className={`form-control ${
                  errors.conteudo ? "is-invalid" : ""
                }`}
                {...register("conteudo", {
                  required: "Conteúdo é obrigatório",
                })}
              />
              {errors.conteudo && (
                <div className="invalid-feedback">
                  {errors.conteudo.message}
                </div>
              )}
            </div>

            <div className="mb-3 d-none">
              <label htmlFor="peritoResponsavel" className="form-label">
                Perito Responsável
              </label>
              <input
                id="peritoResponsavel"
                type="text"
                disabled
                className={`form-control ${
                  errors.peritoResponsavel ? "is-invalid" : ""
                }`}
                {...register("peritoResponsavel", {
                  required: "Perito responsável é obrigatório",
                })}
              />
              {errors.peritoResponsavel && (
                <div className="invalid-feedback">
                  {errors.peritoResponsavel.message}
                </div>
              )}
            </div>

            <div className="mb-4 d-none">
              <label htmlFor="casoReportado" className="form-label">
                Caso Relacionado
              </label>
              <input
                id="casoReportado"
                type="text"
                disabled
                className={`form-control ${
                  errors.casoReportado ? "is-invalid" : ""
                }`}
                {...register("casoReportado", {
                  required: "Caso relacionado é obrigatório",
                })}
              />
              {errors.casoReportado && (
                <div className="invalid-feedback">
                  {errors.casoReportado.message}
                </div>
              )}
            </div>

            <div className="d-flex justify-content-end gap-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                Salvar Relatório
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterReport;
