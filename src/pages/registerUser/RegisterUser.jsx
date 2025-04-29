import { useState } from "react";
import UserForm from "../../components/forms/UserForm";
import axios from "axios";
import { HeaderReq, UserPOST } from "../../api/PathsApi";
import PopUpConfirm from "../../components/popupconfirm/PopUpConfirm"; 
import "./RegisterUser.css";
import { goToHome } from "../../router/Coordinator";
import { useNavigate } from "react-router-dom";

const RegisterUser = () => {
  const token = localStorage.getItem("token");
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate()

  const handleSubmitForm = async (data) => {
    try {
      const response = await axios.post(UserPOST, data, {
        headers: HeaderReq(token),
      });
      console.log("Dados recebidos do formulário:", response.data);

      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        goToHome(navigate)
      }, 3000);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  };

  return (
    <div className="page-container">
      {showPopup && <PopUpConfirm entityName="usuário" />}
      <UserForm onSubmit={handleSubmitForm} />
    </div>
  );
};

export default RegisterUser;
