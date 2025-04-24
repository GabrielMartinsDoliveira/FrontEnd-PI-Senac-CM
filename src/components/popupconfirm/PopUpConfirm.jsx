import React from 'react';


const PopUpConfirm = (props) => {
    return (
      <div className="alert alert-success text-center mt-4" role="alert">
        <h4>{props.entityName} criada com sucesso!</h4>
      </div>
    );
  };

  export default PopUpConfirm