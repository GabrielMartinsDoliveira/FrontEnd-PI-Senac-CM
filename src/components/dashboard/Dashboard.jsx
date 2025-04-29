// src/components/Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { CasesGET, HeaderReq } from "../../api/PathsApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios
      .get(`${CasesGET}`, {headers: HeaderReq(token)})
      .then((response) => {
        setCases(response.data);
        setResponsaveis([
          ...new Set(
            response.data.map((c) => c.responsavel?.nome || "Desconhecido")
          ),
        ]);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar casos:", error);
        setLoading(false);
      });
  }, []);

  const filteredCases = selectedResponsavel
    ? cases.filter(
        (c) => (c.responsavel?.nome || "Desconhecido") === selectedResponsavel
      )
    : cases;

  const casosPorMes = filteredCases.reduce((acc, curr) => {
    const data = new Date(curr.dataOcorrencia);
    const mesAno = `${data.getMonth() + 1}/${data.getFullYear()}`;
    acc[mesAno] = (acc[mesAno] || 0) + 1;
    return acc;
  }, {});

  const mesesOrdenados = Object.keys(casosPorMes).sort((a, b) => {
    const [mesA, anoA] = a.split("/").map(Number);
    const [mesB, anoB] = b.split("/").map(Number);
    return new Date(anoA, mesA - 1) - new Date(anoB, mesB - 1);
  });

  const data = {
    labels: mesesOrdenados,
    datasets: [
      {
        label: "Casos por Mês",
        data: mesesOrdenados.map((mes) => casosPorMes[mes]),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Casos Registrados por Mês" },
    },
    maintainAspectRatio: false,
  };

  return (
    <div
      className="fixed"
      style={{
        marginTop: "12vh",
        marginLeft: "12vw",
        width: "80%",
        height: "80vh",
        backgroundColor: "#dee1eb",
        padding: "1rem",
        overflowY: "auto",
        border: "2px solid #0000009d",
      }}
    >
      <h1 className="text-2xl font-bold mb-6">Dashboard de Casos</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          <div className="mb-6">
            <label className="block mb-2 text-gray-700 font-semibold">
              Filtrar por Responsável:
            </label>
            <select
              className="p-2 rounded-lg border border-gray-400 w-full md:w-1/3"
              value={selectedResponsavel}
              onChange={(e) => setSelectedResponsavel(e.target.value)}
            >
              <option value="">Todos</option>
              {responsaveis.map((resp, index) => (
                <option key={index} value={resp}>
                  {resp}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4 h-[60vh]">
            <Bar options={options} data={data} />
          </div>
        </>
      )}
    </div>
  );
}
