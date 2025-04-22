import UserForm from "../../utils/UserForm";
import axios from "axios";
import { HeaderReq, UserPOST } from "../../api/PathsApi";
import "./Register.css";

const RegisterUser = () => {
  const handleSubmitForm = async (data) => {
    const response = await axios.post(UserPOST, data, { headers: HeaderReq });
    console.log("Dados recebidos do formulário:", response.data);
  };

  return (
    <div>
      <h2>Cadastro de Usuário</h2>
      <UserForm onSubmit={handleSubmitForm} />
    </div>
  );
};

export default RegisterUser;
