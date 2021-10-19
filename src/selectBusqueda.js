import React from "react";

const resources = require('./resources')
export default function Selectbusqueda ({tipoCategoriaOnChange}) {
    return (
        <select id="inputState" class="form-control" onChange={tipoCategoriaOnChange}>
        <option selected>Escoger categoria de busqueda</option>
        {
          Object.keys(resources.formSh).map((each) =>{
            if(!['area','fechaDeIngreso','fechaDeRegistro'].includes(each)){
              return (
                <option value={each}>{each}</option>
              )
          }
          })
        }
      </select>
    )
}