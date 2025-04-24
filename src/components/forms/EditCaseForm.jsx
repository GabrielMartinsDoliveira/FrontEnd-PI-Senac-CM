import { RiCloseFill, RiSaveFill } from "react-icons/ri";

function EditCaseForm({ formData, onChange, onCancel, onSubmit, error }) {
  return (
    <form onSubmit={onSubmit} className="case-form">
      <h2>Editar Caso</h2>

      <div className="form-group">
        <label>Título:</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={onChange}
          required
        />
      </div>

      <div className="form-group">
        <label>Descrição:</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={onChange}
          required
          rows={5}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            required
          >
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Data Ocorrência:</label>
          <input
            type="date"
            name="dataOcorrencia"
            value={formData.dataOcorrencia}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Data Abertura:</label>
          <input
            type="date"
            name="dataAbertura"
            value={formData.dataAbertura}
            onChange={onChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Data Fechamento:</label>
          <input
            type="date"
            name="dataFechamento"
            value={formData.dataFechamento}
            onChange={onChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Latitude:</label>
        <input
          type="number"
          name="localidade.latitude"
          value={formData.localidade.latitude}
          onChange={onChange}
          step="any"
        />
      </div>

      <div className="form-group">
        <label>Longitude:</label>
        <input
          type="number"
          name="localidade.longitude"
          value={formData.localidade.longitude}
          onChange={onChange}
          step="any"
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="form-actions">
        <button type="button" className="cancel-button" onClick={onCancel}>
          <RiCloseFill /> Cancelar
        </button>
        <button type="submit" className="save-button">
          <RiSaveFill /> Salvar
        </button>
      </div>
    </form>
  );
}

export default EditCaseForm;