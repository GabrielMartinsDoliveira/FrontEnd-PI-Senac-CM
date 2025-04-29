import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CasesDetailsGET,
  CaseUpdatePUT,
  EvidencesGET,
  HeaderReq,
  UserByIdGET,
} from "../../api/PathsApi";
import {
  goToCases,
  goToEvidence,
  goToRegisterEvidence,
  goToReport,
} from "../../router/Coordinator";
import axios from "axios";
import { RiEditFill } from "react-icons/ri";
import EditCaseForm from "../../components/forms/EditCaseForm";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

function DetailsCase() {
  const { id } = useParams();
  const [caseDetail, setCaseDetail] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "",
    dataAbertura: "",
    dataOcorrencia: "",
    dataFechamento: "",
    localidade: {
      latitude: "",
      longitude: "",
    },
  });
  const [evidences, setEvidences] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [userRole, setUserRole] = useState(false);
  const userId = localStorage.getItem("userId");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (id) {
      loadCase();
      loadEvidences(id);
      getRoleUser();
    }
  }, [id]);

  const loadCase = async () => {
    try {
      const response = await axios.get(`${CasesDetailsGET}/${id}`, {
        headers: HeaderReq(token),
      });
      setCaseDetail(response.data);
      setFormData({
        titulo: response.data.titulo,
        status: response.data.status,
        descricao: response.data.descricao,
        dataAbertura: response.data.dataAbertura?.split("T")[0],
        dataOcorrencia: response.data.dataOcorrencia?.split("T")[0],
        dataFechamento: response.data.dataFechamento?.split("T")[0] || "",
        localidade: {
          latitude: response.data.localidade?.latitude
            ? parseFloat(response.data.localidade.latitude)
            : "",
          longitude: response.data.localidade?.longitude
            ? parseFloat(response.data.localidade.longitude)
            : "",
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao carregar caso");
      setLoading(false);
    }
  };

  const loadEvidences = async (id) => {
    try {
      const response = await axios.get(`${EvidencesGET}?idCaso=${id}`, {
        headers: HeaderReq(token),
      });
      setEvidences(response.data);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const getRoleUser = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Erro ao obter role do usuário:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${CaseUpdatePUT}/${id}`, formData, {
        headers: HeaderReq(token),
      });
      setCaseDetail(response.data);
      setEditMode(false);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        goToCases(navigate);
      }, 3000);
    } catch (error) {
      console.error("Erro na atualização:", error);
      setError("Erro ao atualizar caso");
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError(null);
  };

  const handleReturnCases = () => {
    goToCases(navigate);
  };
  

  const displayEvidences = () => (
    <div className="row">
      {evidences &&
        evidences.map((evidence) => (
          <div key={evidence._id} className="col-md-6 col-lg-4 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <p>
                  <strong>Tipo:</strong> {evidence.tipo}
                </p>
                <p>
                  <strong>Data Coleta:</strong>{" "}
                  {new Date(evidence.dataColeta).toLocaleDateString("pt-BR")}
                </p>
                <p>
                  <strong>Coletado Por:</strong>{" "}
                  {evidence.coletadoPor?.nome || "Desconhecido"}
                </p>
                <button
                  className="btn btn-sm btn-primary mt-2"
                  onClick={() => goToEvidence(navigate, evidence._id)}
                >
                  <RiEditFill /> Ver Evidência
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  if (error && !editMode)
    return <div className="alert alert-danger">{error}</div>;

  const containerStyle = {
    marginTop: "12vh",
    marginLeft: "12vw",
    padding: "20px",
    minHeight: "88vh",
    backgroundColor: "#dee1eb",
  };
  return (
    <div className="container" style={containerStyle}>
      {showPopup && <PopUpConfirm entityName="Caso" />}
      {editMode ? (
        <EditCaseForm
          formData={formData}
          onChange={handleChange}
          onCancel={toggleEditMode}
          onSubmit={handleSubmit}
          error={error}
        />
      ) : (
        <div>
          <h2 className="mb-4 l-12vw">Detalhes do Caso</h2>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card p-3">
                <strong>Título:</strong>
                <p>{caseDetail?.titulo}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3">
                <strong>Descrição:</strong>
                <p>{caseDetail?.descricao}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <strong>Status:</strong>
                <p>{caseDetail?.status}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <strong>Responsável:</strong>
                <p>{caseDetail?.responsavel?.nome}</p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <strong>Data Ocorrência:</strong>
                <p>
                  {new Date(caseDetail?.dataOcorrencia).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <strong>Data Abertura:</strong>
                <p>
                  {new Date(caseDetail?.dataAbertura).toLocaleDateString(
                    "pt-BR"
                  )}
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card p-3">
                <strong>Data Fechamento:</strong>
                <p>
                  {caseDetail?.dataFechamento
                    ? new Date(caseDetail.dataFechamento).toLocaleDateString(
                        "pt-BR"
                      )
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5">
            <h3>Evidências</h3>
            {evidences ? displayEvidences() : <p>Carregando evidências...</p>}
          </div>

          <div className="d-flex flex-wrap gap-2 mt-4">
            <button
              className="btn btn-success"
              onClick={() => goToRegisterEvidence(navigate, caseDetail._id)}
            >
              Adicionar Evidência
            </button>
            {userRole !== "assistente" ? (
              <>
                <button className="btn btn-primary" onClick={toggleEditMode}>
                  <RiEditFill /> Editar Caso
                </button>
                <button
                  className="btn btn-warning"
                  onClick={() => goToReport(navigate, caseDetail?._id)}
                >
                  Gerar Relatório
                </button>
              </>
            ) : null}

            <button className="btn btn-secondary" onClick={handleReturnCases}>
              Voltar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsCase;
