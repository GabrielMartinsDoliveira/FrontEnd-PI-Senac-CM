import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LaudoGET, HeaderReq, EvidenceDetailsGET } from "../../api/PathsApi";
import axios from "axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

function DetailsLaudo() {
  const { idLaudo } = useParams();
  const [laudo, setLaudo] = useState(null);
  const [evidence, setEvidence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const idFormatado = idLaudo.startsWith(":") ? idLaudo.slice(1) : idLaudo;

  useEffect(() => {
    loadLaudo();
  }, []);

  const loadLaudo = async () => {
    try {
      const response = await axios.get(`${LaudoGET}/${idFormatado}`, {
        headers: HeaderReq(token),
      });
      setLaudo(response.data);

      if (response.data.evidencia) {
        const evidResponse = await axios.get(
          `${EvidenceDetailsGET}/${response.data.evidencia}`,
          { headers: HeaderReq(token) }
        );
        setEvidence(evidResponse.data);
      }
      setLoading(false);
    } catch (error) {
      console.log("Erro na requisição:", error);
      setError("Erro ao carregar laudo");
      setLoading(false);
    }
  };

  const handleReturn = () => {
    navigate(-1);
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("laudo-pdf");

    if (input) {
      const canvas = await html2canvas(input, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`laudo-${idFormatado}.pdf`);
    }
  };
  if (loading)
    return <div className="text-center my-5">Carregando laudo...</div>;
  if (error)
    return <div className="alert alert-danger text-center my-5">{error}</div>;

  return (
    <div
      className="container py-5"
      style={{
        marginTop: "12vh",
        marginLeft: "12vw",
        padding: "20px",
        minHeight: "88vh",
        backgroundColor: "#dee1eb",
      }}
    >
      <div className="card shadow p-4">
        <div id="laudo-pdf">
          <h2 className="text-center mb-4">Detalhes do Laudo</h2>

          <div className="row mb-3">
            <div className="col-md-6">
              <h5>Data de Emissão</h5>
              <p>{new Date(laudo?.dataEmissao).toLocaleDateString()}</p>
            </div>

            <div className="col-md-6">
              <h5>Descrição</h5>
              <p>{laudo?.descricao}</p>
            </div>
          </div>

          {evidence && (
            <>
              <hr />
              <h3 className="text-center mb-4">Evidência Associada</h3>

              <div className="row mb-3">
                <div className="col-md-4">
                  <h5>Tipo</h5>
                  <p>{evidence.tipo}</p>
                </div>

                <div className="col-md-4">
                  <h5>Data de Coleta</h5>
                  <p>{new Date(evidence.dataColeta).toLocaleDateString()}</p>
                </div>

                <div className="col-md-4">
                  <h5>Localização</h5>
                  <p>
                    {evidence.localColeta?.latitude &&
                    evidence.localColeta?.longitude
                      ? `${evidence.localColeta.latitude}, ${evidence.localColeta.longitude}`
                      : "N/A"}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
        <div className="d-flex justify-content-center mt-4 gap-4">
          <button onClick={handleReturn} className="btn btn-secondary ">
            Voltar
          </button>
          <button onClick={handleDownloadPDF} className="btn btn-primary">
            Baixar PDF
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsLaudo;
