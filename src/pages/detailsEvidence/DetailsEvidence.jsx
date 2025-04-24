import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EvidenceDetailsGET,
  HeaderReq,
  EvidencePUT,
  LaudoGET,
} from "../../api/PathsApi";
import { goToLaudo } from "../../router/Coordinator";
import axios from "axios";
import "./DetailsEvidence.css";
import { RiEditFill } from "react-icons/ri";
import EditEvidenceForm from "../../components/forms/EditEvidenceForm";

function DetailsEvidence() {
  const { idEvidencia } = useParams();
  const [evidence, setEvidence] = useState(null);
  const [laudo, setLaudo] = useState(null);
  const [formData, setFormData] = useState({
    tipo: "",
    descricao: "",
    dataColeta: "",
    localColeta: {
      latitude: "",
      longitude: "",
    },
  });
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (idEvidencia) {
      loadEvidence();
      loadLaudo();
    }
  }, [idEvidencia]);

  const loadEvidence = async () => {
    try {
      const response = await axios.get(`${EvidenceDetailsGET}/${idEvidencia}`, {
        headers: HeaderReq(token),
      });
      setEvidence(response.data);
      setFormData({
        tipo: response.data.tipo,
        descricao: response.data.descricao,
        dataColeta: response.data.dataColeta.split("T")[0],
        localColeta: {
          latitude: response.data.localColeta?.latitude || "",
          longitude: response.data.localColeta?.longitude || "",
        },
      });
      setLoading(false);
    } catch (error) {
      console.log("Erro na requisição:", error);
      setError("Erro ao carregar evidência");
      setLoading(false);
    }
  };

  const loadLaudo = async () => {
    try {
      const response = axios.get(`${LaudoGET}/idEvidencia=${idEvidencia}`, {headers: HeaderReq(token)});
      setLaudo(response.data);
    } catch (error) {
      console.log("Erro na requisição:", error);
    }
  };

  const displayLaudo = () => {
    return (
      laudo &&
      laudo.map((laudo) => (
        <div key={laudo._id} className="laudo">
          <p>Data Emissão: {laudo.dataEmissao}</p>
          <p>Descrição: {laudo.descricao}</p>
          {/* <RiEditFill onClick={() => goTolaudo(navigate, laudo._id)} /> */}
        </div>
      ))
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("localColeta.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        localColeta: {
          ...prev.localColeta,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${EvidencePUT}/${idEvidencia}`,
        formData,
        { headers: HeaderReq(token) }
      );
      setEvidence(response.data);
      setEditMode(false);
    } catch (error) {
      console.log("Erro na atualização:", error);
      setError("Erro ao atualizar evidência");
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError(null);
  };

  const handleReturnCase = () => {
    navigate(-1);
  };

  if (loading) return <div className="loading">Carregando evidência...</div>;
  if (error && !editMode) return <div className="error">{error}</div>;

  return (
    <div className="container-evidence">
      {editMode ? (
        <EditEvidenceForm
          formData={formData}
          onChange={handleChange}
          onCancel={toggleEditMode}
          onSubmit={handleSubmit}
          error={error}
        />
      ) : (
        <div className="evidence-details">
          <h2>Detalhes da Evidência</h2>

          <div className="details-grid">
            <div className="detail-item">
              <span className="label">Tipo:</span>
              <span className="value">{evidence?.tipo}</span>
            </div>

            <div className="detail-item">
              <span className="label">Descrição:</span>
              <span className="value">{evidence?.descricao}</span>
            </div>

            <div className="detail-item">
              <span className="label">Data de Coleta:</span>
              <span className="value">
                {new Date(evidence?.dataColeta).toLocaleDateString()}
              </span>
            </div>

            <div className="detail-item">
              <span className="label">Coletado por:</span>
              <span className="value">
                {evidence?.coletadoPor?.nome || "Desconhecido"}
              </span>
            </div>

            {evidence?.localColeta && (
              <>
                <div className="detail-item">
                  <span className="label">Localização (Latitude):</span>
                  <span className="value">
                    {evidence.localColeta.latitude || "N/A"}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="label">Localização (Longitude):</span>
                  <span className="value">
                    {evidence.localColeta.longitude || "N/A"}
                  </span>
                </div>
              </>
            )}

            <div className="detail-item">
              <span className="label">Caso relacionado:</span>
              <span className="value">
                {evidence?.idCaso?.titulo || evidence?.idCaso || "N/A"}
              </span>
            </div>
            {laudo ? displayLaudo : null}
          </div>

          <div className="actions">
            <button>
              <RiEditFill /> Editar Evidência
            </button>
            <button onClick={handleReturnCase}>Voltar</button>

            {!laudo ? (
              <button onClick={() => goToLaudo(navigate, evidence?._id)}>
                Gerar Laudo
              </button>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsEvidence;
