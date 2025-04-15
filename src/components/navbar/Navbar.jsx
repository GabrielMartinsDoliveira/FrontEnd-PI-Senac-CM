import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { BiLogOut } from "react-icons/bi";
import { FaUserGear } from "react-icons/fa6";
import { IoDocumentText } from "react-icons/io5";
import './Navbar.css'
import { goToHome } from "../../router/Coordinator";

const Navbar = () => {
  const [caseFlag, setCaseFlag] = useState(false);
  const [userFlag, setUserFlag] = useState(false);
  const navigate = useNavigate()

  const handleCaseFlag = () => {
    setCaseFlag(!caseFlag);
  };

  const handleUserFlag = () => {
    setUserFlag(!userFlag);
  };

  const handleDashBoard = () =>{
    goToHome(navigate)
  }

  return (
    <nav>
      <div className={caseFlag ? "active" : ""}>
        <div onClick={() => handleCaseFlag()}>
          <IoDocumentText />
          <p>CASOS</p>
        </div>
        {caseFlag ? (
          <li>
            <Link to="/cadastrar-caso">
              <ul>Cadastrar Caso</ul>
            </Link>
            <Link to="/casos">
              <ul>Visualizar Casos</ul>
            </Link>
          </li>
        ) : null}
      </div>
      <div className={userFlag ? "active" : ""}>
        <div onClick={() => handleUserFlag()}>
          <FaUserGear />
          <p>USUÁRIO</p>
        </div>
        {userFlag ? (
          <li>
            <Link to="/cadastrar-usuario">
              <ul>Cadastrar Usuário</ul>
            </Link>
            <Link to="/atualizar-dados">
              <ul>Atualizar Dados</ul>
            </Link>
          </li>
        ) : null}
      </div>
      <div>
        <div onClick={()=> handleDashBoard()}>
          <MdDashboard />
          <p>DASHBOARD</p>
        </div>
      </div>
      <div>
        <div>
          <BiLogOut />
          <p>SAIR</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
