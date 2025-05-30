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
  ArcElement
} from "chart.js";
import { CasesGET, HeaderReq, PacientsGET } from "../../api/PathsApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [pacients, setPacients] = useState([]);
  const [responsaveis, setResponsaveis] = useState([]);
  const [selectedResponsavel, setSelectedResponsavel] = useState("");
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('token');

  useEffect(() => {
    // Carrega casos
    axios
      .get(`${CasesGET}`, {headers: HeaderReq(token)})
      .then((response) => {
        setCases(response.data);
        setResponsaveis([
          ...new Set(
            response.data.map((c) => c.responsavel?.nome || "Desconhecido")
          ),
        ]);
      })
      .catch((error) => {
        console.error("Erro ao buscar casos:", error);
      });

    // Carrega pacientes
    axios
      .get(`${PacientsGET}`, {headers: HeaderReq(token)})
      .then((response) => {
        setPacients(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar pacientes:", error);
        setLoading(false);
      });
  }, [token]);

  const filteredCases = selectedResponsavel
    ? cases.filter(
        (c) => (c.responsavel?.nome || "Desconhecido") === selectedResponsavel
      )
    : cases;

  // Processamento dos dados para o gráfico de barras
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

  // Dados para o gráfico de barras
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

  // Processamento dos dados para o gráfico de pizza (distribuição por gênero)
  const genderDistribution = pacients.reduce((acc, pacient) => {
    const gender = pacient.genero || "Não informado";
    acc[gender] = (acc[gender] || 0) + 1;
    return acc;
  }, {});

  // Dados para o gráfico de pizza
  const pieData = {
    labels: Object.keys(genderDistribution),
    datasets: [
      {
        data: Object.values(genderDistribution),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Casos Registrados por Mês" },
    },
    maintainAspectRatio: false,
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Distribuição de Pacientes por Gênero" },
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-white rounded-xl shadow-lg p-4 h-[40vh]">
              <Bar options={barOptions} data={barData} />
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 h-[40vh]">
              <Pie options={pieOptions} data={pieData} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}