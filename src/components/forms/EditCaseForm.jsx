import { RiSaveFill } from "react-icons/ri";

function EditCaseForm({ formData, onChange, onCancel, onSubmit, error }) {
  return (
    <form onSubmit={onSubmit} className="container my-4">
      <h2 className="text-center mb-4">Editar Caso</h2>

      <div className="mb-3">
        <label className="form-label">Título:</label>
        <input
          type="text"
          name="titulo"
          value={formData.titulo}
          onChange={onChange}
          required
          className="form-control"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Descrição:</label>
        <textarea
          name="descricao"
          value={formData.descricao}
          onChange={onChange}
          required
          rows={5}
          className="form-control"
        />
      </div>

      <div className="row">
        <div className="col-md-4 mb-3">
          <label className="form-label">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={onChange}
            required
            className="form-select"
          >
            <option value="Em andamento">Em andamento</option>
            <option value="Finalizado">Finalizado</option>
            <option value="Arquivado">Arquivado</option>
          </select>
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Data Ocorrência:</label>
          <input
            type="date"
            name="dataOcorrencia"
            value={formData.dataOcorrencia}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Data Abertura:</label>
          <input
            type="date"
            name="dataAbertura"
            value={formData.dataAbertura}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-4 mb-3">
          <label className="form-label">Data Fechamento:</label>
          <input
            type="date"
            name="dataFechamento"
            value={formData.dataFechamento}
            onChange={onChange}
            className="form-control"
          />
        </div>
      </div>

      <div className="d-flex justify-content-space-evenly">
        <div className="col-md-6 mb-3">
          <label className="form-label">Latitude:</label>
          <input
            type="number"
            name="localidade.latitude"
            value={formData.localidade.latitude}
            onChange={onChange}
            step="any"
            className="form-control"
          />
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Longitude:</label>
          <input
            type="number"
            name="localidade.longitude"
            value={formData.localidade.longitude}
            onChange={onChange}
            step="any"
            className="form-control"
          />
        </div>
      </div>

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-success">
          <RiSaveFill /> Salvar
        </button>
      </div>
    </form>
  );
}

export default EditCaseForm;
