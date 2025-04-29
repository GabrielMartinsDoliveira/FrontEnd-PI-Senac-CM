import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ReportGET,
  HeaderReq,
  UserByIdGET,
  CasesDetailsGET,
} from "../../api/PathsApi";
import axios from "axios";
import "./DetailsReport.css";

function DetailsReport() {
  const { idReport } = useParams();
  const [report, setReport] = useState(null);
  const [expert, setExpert] = useState(null);
  const [caseData, setCaseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (idReport) {
      loadReport();
    }
  }, [idReport]);

  const loadReport = async () => {
    try {
      // Carrega os dados do relatório
      const reportResponse = await axios.get(`${ReportGET}/${idReport}`, {
        headers: HeaderReq(token),
      });
      setReport(reportResponse.data);

      // Carrega os dados do perito responsável
      if (reportResponse.data.peritoResponsavel) {
        const expertResponse = await axios.get(
          `${UserByIdGET}/${reportResponse.data.peritoResponsavel}`,
          { headers: HeaderReq(token) }
        );
        setExpert(expertResponse.data);
      }

      // Carrega os dados do caso reportado
      if (reportResponse.data.casoReportado) {
        const caseResponse = await axios.get(
          `${CasesDetailsGET}/${reportResponse.data.casoReportado}`,
          { headers: HeaderReq(token) }
        );
        setCaseData(caseResponse.data);
      }

      setLoading(false);
    } catch (error) {
      console.log("Erro na requisição:", error);
      setError("Erro ao carregar relatório");
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  if (loading) return <div className="loading">Carregando relatório...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="container-report">
      <div className="report-details">
        <h2>Detalhes do Relatório</h2>

        <div className="details-grid">
          <div className="detail-item">
            <span className="label">Título:</span>
            <span className="value">{report?.titulo}</span>
          </div>

          <div className="detail-item">
            <span className="label">Data de Criação:</span>
            <span className="value">
              {new Date(report?.dataCriacao).toLocaleDateString()}
            </span>
          </div>

          <div className="detail-item full-width">
            <span className="label">Conteúdo:</span>
            <div className="value content-box">{report?.conteudo}</div>
          </div>

          {expert && (
            <>
              <h3>Perito Responsável</h3>
              <div className="detail-item">
                <span className="label">Nome:</span>
                <span className="value">{expert.nome}</span>
              </div>

              <div className="detail-item">
                <span className="label">Email:</span>
                <span className="value">{expert.email}</span>
              </div>
            </>
          )}

          {caseData && (
            <>
              <h3>Caso Relacionado</h3>
              <div className="detail-item">
                <span className="label">Título do Caso:</span>
                <span className="value">{caseData.titulo}</span>
              </div>

              <div className="detail-item">
                <span className="label">Descrição:</span>
                <span className="value">{caseData.descricao}</span>
              </div>

              <div className="detail-item">
                <span className="label">Status:</span>
                <span className="value">{caseData.status}</span>
              </div>
            </>
          )}
        </div>

        <div className="actions">
          <button onClick={handleReturn}>Voltar</button>
        </div>
      </div>
    </div>
  );
}

export default DetailsReport;
