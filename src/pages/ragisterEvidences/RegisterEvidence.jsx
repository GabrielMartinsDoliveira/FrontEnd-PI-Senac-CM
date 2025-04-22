import axios from "axios";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { EvidencePOST, HeaderReq, UserByIdGET } from "../../api/PathsApi";
import { token, userId } from "../../utils/Constants";
import "./RegisterEvidence.css"

const RegisterEvidence = () => {
  const { idCaso } = useParams();  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      dataColeta: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
    },
  });
  const [nomeColetor,setNomeColetor] = useState(null)

  const getUserEvidence = async () => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });      
      setValue("coletadoPor", response.data._id);
      setNomeColetor(response.data.nome);
    } catch (error) {
      console.error("Erro ao achar o usuário:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(`${EvidencePOST}`, data, {
        headers: HeaderReq(token),
      });
      console.log("Evidência criada com sucesso", response.data);      
    } catch (error) {
      console.error("Erro ao criar evidênca: ", error);
    }
  };

  useEffect(()=>{
    console.log(idCaso)
    getUserEvidence()
    setValue("idCaso", idCaso)
  },[setValue, idCaso])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div >
        <label htmlFor="idCaso">ID do Caso</label>
        <input
          id="idCaso"
          {...register("idCaso", { required: "Campo obrigatório" })}
        />
        {errors.idCaso && <p>{errors.idCaso.message}</p>}
      </div>

      <div>
        <label htmlFor="tipo">Tipo</label>
        <input
          id="tipo"
          {...register("tipo", { required: "Campo obrigatório" })}
        />
        {errors.tipo && <p>{errors.tipo.message}</p>}
      </div>

      <div>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          {...register("descricao", { required: "Campo obrigatório" })}
        />
        {errors.descricao && <p>{errors.descricao.message}</p>}
      </div>

      <div>
        <label htmlFor="dataColeta">Data da Coleta</label>
        <input
          id="dataColeta"
          type="date"
          {...register("dataColeta", { required: "Campo obrigatório" })}
        />
        {errors.dataColeta && <p>{errors.dataColeta.message}</p>}
      </div>

      <div>
        <label htmlFor="coletadoPor">Coletor Por</label>
        <input
          id="coletadoPor"
          value={nomeColetor}
          disabled
          {...register("coletadoPor", { required: "Campo obrigatório" })}
        />
        {errors.coletadoPor && <p>{errors.coletadoPor.message}</p>}
      </div>

      <div>
        <label htmlFor="latitude">Latitude</label>
        <input
          id="latitude"
          type="number"
          step="any"
          {...register("localColeta.latitude")}
        />
      </div>

      <div>
        <label htmlFor="longitude">Longitude</label>
        <input
          id="longitude"
          type="number"
          step="any"
          {...register("localColeta.longitude")}
        />
      </div>

      <button type="submit">Salvar Evidência</button>
    </form>
  );
};

export default RegisterEvidence;
