import React from "react";

const PopUpConfirm = (props) => {
  return (
    <div
      className="alert alert-success text-center"
      role="alert"
      style={{
        position: "fixed",
        bottom: "20px",
        left: "10px",
        right: "10px",
        margin: "0 auto",
        maxWidth: "600px",
        zIndex: 1000,
      }}
    >
      <h4>Operação de {props.entityName} feita com sucesso!</h4>
    </div>
  );
};

export default PopUpConfirm;
