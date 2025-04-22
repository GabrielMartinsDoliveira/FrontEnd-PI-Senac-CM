import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CasesDetailsGET, EvidencesGET, HeaderReq } from "../../api/PathsApi";
import { goToCases, goToRegisterEvidence } from "../../router/Coordinator";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import axios from "axios";
import "./DetailsCase.css";

function DetailsCases() {
  const { id } = useParams();
  const [caseDetail, setCaseDetail] = useState(null);
  const [evidences, setEvidences] = useState(null);
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
    } catch (error) {
      console.log("Erro na requisição:", error);
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

  const displayEvidences = () => {
    return (
      evidences &&
      evidences.map((evidence) => {
        return (
          <div key={evidence._id} className="evidence">
            <p>Tipo: {evidence.tipo}</p>
            <p>
              Data Coleta: {new Date(evidence.dataColeta).toLocaleDateString()}
            </p>
            <p>Coletado Por: {evidence.coletadoPor?.nome || "Desconhecido"}</p>
          </div>
        );
      })
    );
  };
  const handleReturnCases = () => {
    goToCases(navigate);
  };


  return (
    <>
      <Header />
      <Navbar />
      <div className="container">
        {caseDetail ? (
          <div className="case-details">
            <p>Titulo: {caseDetail.titulo}</p>
            <p>Descrição: {caseDetail.descricao}</p>
            <p>Status: {caseDetail.status}</p>
            <p>Responsável: {caseDetail?.responsavel?.nome}</p>
            <p>Data Ocorrência: {caseDetail?.dataOcorrencia}</p>
            <p>
              Data Abertura:{" "}
              {new Date(caseDetail.dataAbertura).toLocaleDateString()}
            </p>
            <p>Data Fechamento: {caseDetail.dataFechamento || "N/A"}</p>
            {evidences ? displayEvidences() : null}
            <button
              onClick={() => goToRegisterEvidence(navigate, caseDetail?._id)}
            >
              Adicionar Evidência
            </button>
            <button>Editar</button>
            <button onClick={handleReturnCases}>Voltar</button>
          </div>
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </>
  );
}

export default DetailsCases;
