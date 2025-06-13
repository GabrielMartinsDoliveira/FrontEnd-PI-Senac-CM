import { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { CasesGET, HeaderReq, PacientsGET } from "../../api/PathsApi";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [pacients, setPacients] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState("");
  const [selectedChart, setSelectedChart] = useState("casosPorMes");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get(CasesGET, { headers: HeaderReq(token) })
      .then((response) => {
        setCases(response.data);
        setResponsaveis([...new Set(response.data.map((c) => c.responsavel?.nome || "Desconhecido"))]);
      })
      .catch((err) => console.error("Erro ao buscar casos:", err));

    axios.get(PacientsGET, { headers: HeaderReq(token) })
      .then((response) => {
        setPacients(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar pacientes:", err);
        setLoading(false);
      });
  }, [token]);

  const filteredCases = selectedResponsavel
    ? cases.filter((c) => (c.responsavel?.nome || "Desconhecido") === selectedResponsavel)
    : cases;

  // --- Gráfico de Casos por Mês
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

  const barData = {
    labels: mesesOrdenados,
    datasets: [
      {
        label: "Casos por Mês",
        data: mesesOrdenados.map((mes) => casosPorMes[mes]),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  // --- Gráfico de Distribuição por Gênero
  const genderDistribution = pacients.reduce((acc, p) => {
    const gender = p.genero || "Não informado";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  const pieDataGenero = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: ["#3b82f6", "#f59e0b", "#ef4444", "#10b981", "#8b5cf6"],
      },
    ],
  };

  // --- Gráfico de Casos por Status
  const statusCounts = filteredCases.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] || 0) + 1;
    return acc;
  }, {});

  const pieDataStatus = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: ["#3b82f6", "#facc15", "#f43f5e", "#10b981"],
      },
    ],
  };

  // --- Gráfico de Pacientes por Faixa Etária
  const idadeFaixas = { "0-18": 0, "19-35": 0, "36-60": 0, "61+": 0, "Não informado": 0 };
  pacients.forEach(p => {
    const idade = p.idade;
    if (idade == null) idadeFaixas["Não informado"]++;
    else if (idade <= 18) idadeFaixas["0-18"]++;
    else if (idade <= 35) idadeFaixas["19-35"]++;
    else if (idade <= 60) idadeFaixas["36-60"]++;
    else idadeFaixas["61+"]++;
  });

  const pieDataIdade = {
    labels: Object.keys(idadeFaixas),
    datasets: [
      {
        data: Object.values(idadeFaixas),
        backgroundColor: ["#93c5fd", "#fde68a", "#fca5a5", "#6ee7b7", "#c4b5fd"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "" },
    },
    maintainAspectRatio: false,
  };

  // Define qual gráfico exibir
  const renderChart = () => {
    switch (selectedChart) {
      case "casosPorMes":
        return <Bar data={barData} options={{ ...chartOptions, title: { text: "Casos por Mês" } }} />;
      case "genero":
        return <Pie data={pieDataGenero} options={{ ...chartOptions, title: { text: "Por Gênero" } }} />;
      case "status":
        return <Pie data={pieDataStatus} options={{ ...chartOptions, title: { text: "Por Status" } }} />;
      case "idade":
        return <Pie data={pieDataIdade} options={{ ...chartOptions, title: { text: "Por Faixa Etária" } }} />;
      default:
        return null;
    }
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
      <h1 className="text-2xl font-bold mb-4">Dashboard de Casos</h1>

      {loading ? (
        <p>Carregando dados...</p>
      ) : (
        <>
          {/* Filtro por responsável */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold">Filtrar por Responsável:</label>
            <select
              className="p-2 rounded border border-gray-400 w-full md:w-1/3"
              value={selectedResponsavel}
              onChange={(e) => setSelectedResponsavel(e.target.value)}
            >
              <option value="">Todos</option>
              {responsaveis.map((resp, i) => (
                <option key={i} value={resp}>{resp}</option>
              ))}
            </select>
          </div>

          {/* Seletor de gráfico */}
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              { key: "casosPorMes", label: "Casos por Mês" },
              { key: "genero", label: "Gênero" },
              { key: "status", label: "Status dos Casos" },
              { key: "idade", label: "Faixa Etária" },
            ].map((chart) => (
              <button
                key={chart.key}
                className={`px-4 py-2 rounded ${
                  selectedChart === chart.key ? "bg-blue-600 text-white" : "bg-white border"
                }`}
                onClick={() => setSelectedChart(chart.key)}
              >
                {chart.label}
              </button>
            ))}
          </div>

          {/* Exibição dinâmica do gráfico */}
          <div className="bg-white rounded-xl shadow-lg p-4 h-[50vh]">
            {renderChart()}
          </div>
        </>
      )}
    </div>
  );
}
