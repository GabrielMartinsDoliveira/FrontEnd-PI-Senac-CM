import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CasesDetailsGET,
  CaseUpdatePUT,
  EvidencesGET,
  HeaderReq,
} from "../../api/PathsApi";
import {
  goToCases,
  goToEvidence,
  goToRegisterEvidence,
  goToReport,
} from "../../router/Coordinator";
import axios from "axios";
import "./DetailsCase.css";
import { RiEditFill } from "react-icons/ri";
import EditCaseForm from "../../components/forms/EditCaseForm";

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

  useEffect(() => {
    if (id) {
      loadCase();
      loadEvidences(id);
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
        dataAbertura: response.data.dataAbertura,
        dataOcorrencia: response.data.dataOcorrencia,
        dataFechamento: response.data.dataFechamento || "",
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
      console.log("Erro na requisição:", error);
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
      console.log("Erro na requisição:", error);
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
    } catch (error) {
      console.log("Erro na atualização:", error);
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

  const displayEvidences = () => {
    return (
      evidences &&
      evidences.map((evidence) => (
        <div key={evidence._id} className="evidence">
          <p>Tipo: {evidence.tipo}</p>
          <p>
            Data Coleta: {new Date(evidence.dataColeta).toLocaleDateString("pt-BR")}
          </p>
          <p>Coletado Por: {evidence.coletadoPor?.nome || "Desconhecido"}</p>
          <RiEditFill onClick={() => goToEvidence(navigate, evidence._id)} />
        </div>
      ))
    );
  };

  if (error && !editMode) return <p>{error}</p>;

  return (
    <div className="container-case">
      {editMode ? (
        <EditCaseForm
          formData={formData}
          onChange={handleChange}
          onCancel={toggleEditMode}
          onSubmit={handleSubmit}
          error={error}
        />
      ) : (
        <div className="case-details">
          <h2>Detalhes do Caso</h2>

          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Título:</span>
              <span className="value">{caseDetail?.titulo}</span>
            </div>

            <div className="detail-item">
              <span className="label">Descrição:</span>
              <span className="value">{caseDetail?.descricao}</span>
            </div>

            <div className="detail-item">
              <span className="label">Status:</span>
              <span className="value">{caseDetail?.status}</span>
            </div>

            <div className="detail-item">
              <span className="label">Responsável:</span>
              <span className="value">{caseDetail?.responsavel?.nome}</span>
            </div>

            <div className="detail-item">
              <span className="label">Data Ocorrência:</span>
              <span className="value">{caseDetail?.dataOcorrencia}</span>
            </div>

            <div className="detail-item">
              <span className="label">Data Abertura:</span>
              <span className="value">
                {new Date(caseDetail?.dataAbertura).toLocaleDateString("pt-BR")}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Data Fechamento:</span>
              <span className="value">
                {caseDetail?.dataFechamento
                  ? new Date(caseDetail.dataFechamento).toLocaleDateString("pt-BR")
                  : "N/A"}
              </span>
            </div>
          </div>

          <div className="evidence-section">
            <h3>Evidências</h3>
            {evidences ? displayEvidences() : <p>Carregando evidências...</p>}
          </div>

          <div className="actions">
            <button
              onClick={() => goToRegisterEvidence(navigate, caseDetail._id)}
            >
              Adicionar Evidência
            </button>
            <button onClick={toggleEditMode}>
              <RiEditFill /> Editar Caso
            </button>
            <button onClick={handleReturnCases}>Voltar</button>
            <button onClick={() => goToReport(navigate, caseDetail?._id)}>Gerar Relatório</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsCase
