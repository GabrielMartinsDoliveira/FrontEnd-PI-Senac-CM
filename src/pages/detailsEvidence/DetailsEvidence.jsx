import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  EvidenceDetailsGET,
  HeaderReq,
  EvidencePUT,
  LaudoGET,
  UserByIdGET,
  LaudoByEvidenciaGET,
} from "../../api/PathsApi";
import { goToLaudoDetails, goToRegisterLaudo } from "../../router/Coordinator";
import axios from "axios";
import "./DetailsEvidence.css";
import { RiEditFill } from "react-icons/ri";
import EditEvidenceForm from "../../components/forms/EditEvidenceForm";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

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
  const [userRole, setUserRole] = useState(false);
  const userId = localStorage.getItem("userId");
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (idEvidencia) {
      loadEvidence();
      loadLaudo();
      getRoleUser();
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
      const response = await axios.get(
        `${LaudoByEvidenciaGET}/${idEvidencia}`,
        {
          headers: HeaderReq(token),
        }
      );
      setLaudo(response.data);
    } catch (error) {
      console.log("Erro na requisição:", error);
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

  const displayLaudo = () => {
    return (
      laudo && (
        <div className="card p-3 mb-3">
          <h3>Laudo</h3>
          <p>
            <strong>Data Emissão:</strong>{" "}
            {new Date(laudo.dataEmissao).toLocaleDateString()}
          </p>
          <p>
            <strong>Descrição:</strong> {laudo.descricao}
          </p>
        </div>
      )
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
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigate(-1);
      }, 3000);
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

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            localColeta: {
              latitude: position.coords.latitude.toFixed(6),
              longitude: position.coords.longitude.toFixed(6),
            },
          }));
        },
        (error) => {
          console.error("Erro ao obter localização:", error.message);
          alert("Não foi possível obter sua localização.");
        }
      );
    } else {
      alert("Geolocalização não é suportada pelo seu navegador.");
    }
  };

  if (loading)
    return <div className="text-center py-5">Carregando evidência...</div>;
  if (error && !editMode)
    return <div className="alert alert-danger text-center">{error}</div>;

  return (
    <div
      className="container py-4"
      style={{
        marginTop: "12vh",
        marginLeft: "12vw",
        padding: "20px",
        minHeight: "88vh",
        backgroundColor: "#dee1eb",
      }}
    >
      {showPopup && <PopUpConfirm entityName="Evidência" />}
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
          <h2 className="mb-4 text-center">Detalhes da Evidência</h2>

          <div className="row g-3">
            <div className="col-md-6">
              <div className="card p-3 h-100">
                <strong>Tipo:</strong>
                <p>{evidence?.tipo}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 h-100">
                <strong>Descrição:</strong>
                <p>{evidence?.descricao}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 h-100">
                <strong>Data de Coleta:</strong>
                <p>{new Date(evidence?.dataColeta).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card p-3 h-100">
                <strong>Coletado por:</strong>
                <p>{evidence?.coletadoPor?.nome || "Desconhecido"}</p>
              </div>
            </div>

            {evidence?.localColeta && (
              <>
                <div className="col-md-6">
                  <div className="card p-3 h-100">
                    <strong>Latitude:</strong>
                    <p>{evidence.localColeta.latitude || "N/A"}</p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card p-3 h-100">
                    <strong>Longitude:</strong>
                    <p>{evidence.localColeta.longitude || "N/A"}</p>
                  </div>
                </div>
                <button
                  className="btn btn-info"
                  onClick={() => requestLocation()}
                >
                  Preencher Localização Atual
                </button>
              </>
            )}

            <div className="col-12">
              <div className="card p-3">
                <strong>Caso relacionado:</strong>
                <p>{evidence?.idCaso?.titulo || evidence?.idCaso || "N/A"}</p>
              </div>
            </div>

            <div className="col-12">{laudo ? displayLaudo() : null}</div>
          </div>

          <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
            <button className="btn btn-primary" onClick={toggleEditMode}>
              <RiEditFill className="me-2" /> Editar Evidência
            </button>

            <button className="btn btn-secondary" onClick={handleReturnCase}>
              Voltar
            </button>

            {userRole !== "assistente" ? (
              !laudo ? (
                <button
                  className="btn btn-success"
                  onClick={() => goToRegisterLaudo(navigate, evidence?._id)}
                >
                  Gerar Laudo
                </button>
              ) : (
                <button
                  className="btn btn-success"
                  onClick={() => goToLaudoDetails(navigate, laudo?._id)}
                >
                  Visualizar Laudo
                </button>
              )
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

export default DetailsEvidence;
