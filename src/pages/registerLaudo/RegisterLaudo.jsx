import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./RegisterLaudo.css";
import {
  EvidenceDetailsGET,
  HeaderReq,
  LaudoPOST,
  UserByIdGET,
} from "../../api/PathsApi";
import axios from "axios";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm";

const RegisterLaudo = () => {
  const { idEvidencia } = useParams();
  const navigate = useNavigate();
  const [laudo, setLaudo] = useState({
    evidencia: idEvidencia,
    dataEmissao: new Date().toISOString().split("T")[0],
    descricao: "",
  });
  const [evidenceInfo, setEvidenceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const token = localStorage.getItem("token");

  const getEvidenceInfo = async () => {
    try {
      const response = await axios.get(`${EvidenceDetailsGET}/${idEvidencia}`, {
        headers: HeaderReq(token),
      });
      if (!response) {
        throw new Error("Evidência não encontrada");
      }

      setEvidenceInfo(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getEvidenceInfo();
  }, [idEvidencia]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLaudo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${LaudoPOST}`, laudo, {
        headers: HeaderReq(token),
      });

      if (response.status !== 201) {
        throw new Error("Erro ao criar laudo");
      }

      const createdLaudo = response.data;
      console.log("Laudo criado:", createdLaudo);
      setShowPopup(!showPopup);
      setTimeout(() => {
        navigate(-1);
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="loading">Carregando informações da evidência...</div>
    );
  }

  if (error) {
    return <div className="error">Erro: {error}</div>;
  }

  return (
    <div className="laudo-form-container">
      <div className="header">
        <h1>Criar Novo Laudo Técnico</h1>
        <div className="subtitle">
          Para evidência: {evidenceInfo?.tipo} - {evidenceInfo?._id}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="laudo-form">
        <div className="form-section">
          <h2>Informações do Laudo</h2>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dataEmissao">Data de Emissão</label>
              <input
                type="date"
                id="dataEmissao"
                name="dataEmissao"
                value={laudo.dataEmissao}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="descricao">Descrição do Laudo *</label>
            <textarea
              id="descricao"
              name="descricao"
              value={laudo.descricao}
              onChange={handleChange}
              required
              rows={10}
              placeholder="Descreva detalhadamente as análises realizadas, metodologia utilizada, resultados encontrados e conclusões..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Informações da Evidência Relacionada</h2>
          {evidenceInfo && (
            <div className="evidence-info">
              <div className="info-item">
                <span className="label">ID:</span>
                <span className="value">{evidenceInfo._id}</span>
              </div>
              <div className="info-item">
                <span className="label">Tipo:</span>
                <span className="value">{evidenceInfo.tipo}</span>
              </div>
              <div className="info-item">
                <span className="label">Data de Coleta:</span>
                <span className="value">
                  {new Date(evidenceInfo.dataColeta).toLocaleDateString()}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Descrição Original:</span>
                <span className="value">{evidenceInfo.descricao}</span>
              </div>
            </div>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate(-1)}
          >
            Cancelar
          </button>
          <button type="submit" className="submit-button">
            Salvar Laudo
          </button>
        </div>
      </form>
      {showPopup && <PopUpConfirm entityName="Laudo" />}
    </div>
  );
};

export default RegisterLaudo;
