import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaUserGear } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import { goToHome } from "../../router/Coordinator";
import { HeaderReq, UserByIdGET } from "../../api/PathsApi";
import axios from "axios";
import "./Navbar.css";
import { HiMenu } from "react-icons/hi";

const Navbar = () => {
  const [caseFlag, setCaseFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

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

  useEffect(() => {
    getRoleUser();
  }, [userId]);

  const handleUserFlag = () => {
    setUserFlag(!userFlag);
  };

  const handleCaseFlag = () => {
    setCaseFlag(!caseFlag);
  };
  const handleMenu = () => {
    setShowMenu(!showMenu);
  };

  if (loading) return <div>Carregando...</div>;

  const caseItems = [
    {
      path: "/cadastrar-caso",
      label: "Cadastrar Caso",
      roles: ["admin", "perito"],
    },
    {
      path: "/casos",
      label: "Visualizar Casos",
      roles: ["admin", "perito", "assistente"],
    },
  ];

  const userItems = [
    {
      path: "/cadastrar-usuario",
      label: "Cadastrar Usuário",
      roles: ["admin"],
    },
    {
      path: `/atualizar-usuario/${userId}`,
      label: "Atualizar Dados",
      roles: ["admin", "perito", "assistente"],
    },
  ];

  const filteredCaseItems = caseItems.filter((item) =>
    item.roles.includes(userRole)
  );
  const filteredUserItems = userItems.filter((item) =>
    item.roles.includes(userRole)
  );

  return (
    <>
      <div className="d-lg-none mobile-toggle">
        <button className="custom-icon-button" onClick={() => handleMenu()}>
          <HiMenu size={30} />
        </button>
      </div>

      <div
        className={`sidebar d-lg-flex flex-column bg-white ${
          showMenu ? "show" : "hide"
        }`}
      >
        <div className="w-100 text-center">
          <div
            onClick={() => handleCaseFlag()}
            className="w-100 py-2 px-3 d-flex align-items-center gap-2"
            role="button"
          >
            <IoDocumentText size={24} />
            <p className="mb-0">CASOS</p>
          </div>
          {caseFlag && filteredCaseItems.length > 0 && (
            <ul className="list-unstyled w-100">
              {filteredCaseItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-decoration-none d-block px-3 py-1 bg-light text-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-100 text-center">
          <div
            onClick={() => handleUserFlag()}
            className="w-100 py-2 px-3 d-flex align-items-center gap-2"
            role="button"
          >
            <FaUserGear size={24} />
            <p className="mb-0">USUÁRIO</p>
          </div>
          {userFlag && filteredUserItems.length > 0 && (
            <ul className="list-unstyled w-100">
              {filteredUserItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-decoration-none d-block px-3 py-1 bg-light text-dark"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-100 text-center">
          <div
            onClick={() => goToHome(navigate)}
            className="w-100 py-2 px-3 d-flex align-items-center gap-2 text-dark"
            role="button"
          >
            <MdDashboard size={24} />
            <p className="mb-0">DASHBOARD</p>
          </div>
        </div>

        <div className="w-100 text-center">
          <div
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("userId");
              navigate("/");
            }}
            className="w-100 py-2 px-3 d-flex align-items-center gap-2 text-dark"
            role="button"
          >
            <BiLogOut size={24} />
            <p className="mb-0">SAIR</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
