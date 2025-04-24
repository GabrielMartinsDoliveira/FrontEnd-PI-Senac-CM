import UserForm from "../../components/forms/UserForm";
import axios from "axios";
import { HeaderReq, UserPOST } from "../../api/PathsApi";
import "./RegisterUser.css";

const RegisterUser = () => {
  const token = localStorage.getItem('token')
  const handleSubmitForm = async (data) => {
    const response = await axios.post(UserPOST, data, { headers: HeaderReq(token) });
    console.log("Dados recebidos do formulário:", response.data);
  };

  return (
    <div className="page-container">
      <UserForm onSubmit={handleSubmitForm} />
    </div>
  );
};

export default RegisterUser;
