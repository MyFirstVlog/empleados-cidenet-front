import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';


const formSh = {
  tipoID:'',
  numero: '',
  primerNombre:'',
  otroNombre: '',
  primerApellido : '',
  segundoApellido : '',
  pais : '',
  area: '',
  fechaDeRegistro : '',
  fechaDeIngreso : ''
}
const url = "http://localhost:8080/api/users"
const urlSearch = "http://localhost:8080/api/search"
const hoy = new Date().toISOString().slice(0, 10)
const mesAnteriorFinal =  (hoy) => {
  const split = String(Number(hoy.split('-')[1]) - 1)
  if(split < 10){
    const mes = '0' + String(split)
    const splitFinal = hoy.split('-')[0]+'-'+mes+'-'+hoy.split('-')[2]
    return splitFinal
  }
return hoy.split('-')[0]+'-'+split+'-'+hoy.split('-')[2]
}

class App extends Component {

  //Estado para almacenar toda la data
  state = {
    data:[],
    modalInsertar: false,
    modalEliminar: false,
    form:{
      tipoID:'',
      numero: '',
      primerNombre:'',
      otroNombre: '',
      primerApellido : '',
      segundoApellido : '',
      pais : '',
      area: '',
      fechaDeRegistro : '',
      fechaDeIngreso : ''
    },
    tipoModal : '',
    paginadoFinal : 5,
    paginadoInicial : 0,
    cantidadUsers : [],
    formSearch:{
      search:''
    },
    categoria:''
  }

  peticionesGet = () => { 
    axios.get(url).then(response => {
      console.log(response.data)
      this.setState({data : response.data.usuarios, cantidadUsers : Array.from(Array(Math.floor(response.data.total/5) + 1).keys())})
    }).catch(error => {
      console.log(error)
    })
  }

  peticionesGetPaginado = (desde=0,limite=5) => { 
    axios.get(url+'?desde='+desde+'&limite='+limite).then(response => {
      console.log(response.data)
      this.setState({data : response.data.usuarios})
    }).catch(error => {
      console.log(error)
    })
  }

  peticionPost = async () => {
    const obj = {
      ...this.state.form,
      fechaDeRegistro : hoy,
    }
    const json = JSON.stringify(obj)
    await axios.post(url,json,{
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.modalInsertar()
      this.peticionesGet()
    }).catch(error => {
      console.log(error)
    })
  }

  peticionPut = () => {
    const json = JSON.stringify(this.state.form)
    axios.put(`${url}/${this.state.form.numero}`,json , {
      headers: {
        // Overwrite Axios's automatically set Content-Type
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.modalInsertar()
      this.peticionesGet()
    }).catch(error => {
      console.log(error)
    })
  }

  peticionDelete = () => {
    axios.delete(`${url}/${this.state.form.numero}`).then(response=>{
      this.setState({modalEliminar : false})
      this.peticionesGet()
    }).catch(error => {
      console.log(error)
    })
  }

  modalInsertar = () => {
    this.setState({modalInsertar : !this.state.modalInsertar})
  }

  seleccionarUsuario = (usuario) => {
    this.setState({
      tipoModal : 'actualizar',
      form:{
        tipoID:usuario.tipoID,
        numero: usuario.numero,
        primerNombre:usuario.primerNombre,
        otroNombre: usuario.otroNombre,
        primerApellido : usuario.primerApellido,
        segundoApellido : usuario.segundoApellido,
        pais : usuario.pais,
        area: usuario.area,
        fechaDeRegistro : usuario.fechaDeRegistro,
        fechaDeIngreso : usuario.fechaDeIngreso
      }
    })
  }
  
 

  handleChange = async e => {
    e.persist()
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    })

  }

  handleChangeSearch = async e => {
    e.persist()
    await this.setState({
      formSearch:{
        ...this.state.formSearch,
        [e.target.name]: e.target.value
      }
    })
    console.log(this.state.formSearch)

  }

  tipoCategoriaOnChange = () => {
    const select = document.getElementById('inputState')
    const categoria = select.value
    this.setState({categoria})
    console.log({categoria})
  }

  onSubmitBusqueda = (e) => {
    e.preventDefault()
    const {categoria} = this.state
    const {search} = this.state.formSearch
    const urlL = `${url}/${categoria}/${search}`
    console.log({urlL})
    axios.get(`${urlSearch}/${categoria}/${search}`).then(response => {
      console.log(response.data)
      this.setState({data : response.data.results})
      console.log(this.state.data)
    }).catch(error => {
      console.log(error)
    })
  }




  //Ciclo de vida 
  
  componentDidMount() {
    this.peticionesGet()
  }


  render(){
    const {form} = this.state
    return (
      <div className="App">

    <div id="demoFont">CIDENET</div>

    <br />

    <label for="inputState">Elige La categoria que desees Buscar</label>
    <br />
      <select id="inputState" class="form-control" onChange={this.tipoCategoriaOnChange}>
        <option selected>Escoger categoria de busqueda</option>
        {
          Object.keys(formSh).map((each) =>{
            if(!['area','fechaDeIngreso','fechaDeRegistro'].includes(each)){
              return (
                <option value={each}>{each}</option>
              )
          }
          })
        }
      </select>
    <br />

    <form className="form-inline" onSubmit = {this.onSubmitBusqueda}>
        <input className="form-control mr-sm-2" type="text" name="search" id="search"  onChange={this.handleChangeSearch} placeholder="Search" aria-label="Search"/>
    </form>    
    <br />
    <button className="btn btn-outline-info my-2 my-sm-0" onClick = {this.onSubmitBusqueda} type="button">Search</button>
    <br />

  <button className="btn btn-success" onClick={()=>{this.setState({form : null, tipoModal: 'insertar'}); this.modalInsertar()}}>Agregar Usuario</button>
  <br /><br />
    <table className="table ">
      <thead>
        <tr>
          <th>Tipo ID</th>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellidos</th>
          <th>Area</th>
          <th>Pais</th>
          <th>Fecha de Ingreso</th>
          <th>Fecha de Registro</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {this.state.data.map(user =>{
          return(
            <tr> 
              <td>{user.tipoID}</td>
              <td>{user.numero}</td>
              <td>{`${user.primerNombre} ${user.otroNombre ? user.otroNombre : ''}`}</td>
              <td>{`${user.primerApellido} ${user.segundoApellido}`}</td>
              <td>{user.area}</td>
              <td>{user.pais}</td>
              <td>{user.fechaDeIngreso}</td>
              <td>{user.fechaDeRegistro}</td>
              <td>
                <button className="btn btn-primary" onClick={() => {this.seleccionarUsuario(user); this.modalInsertar()}}><FontAwesomeIcon icon={faEdit}/></button>
                {"   "}
                <button className="btn btn-danger" onClick ={()=>{this.seleccionarUsuario(user); this.setState({modalEliminar:true})} } ><FontAwesomeIcon icon={faTrashAlt}/></button>
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>

    <Modal isOpen= {this.state.modalInsertar}>
                <ModalHeader style={{display: 'block'}}>
                  <span style={{float: 'right'}} onClick = {()=> this.modalInsertar()}>x</span>
                </ModalHeader>
                <ModalBody>
                  <div className="form-group">
                    <label htmlFor="tipoID">Tipo de Identifiación</label>
                    <input className="form-control" type="text" name="tipoID" id="tipoID" onChange={this.handleChange} value = {form ? form.tipoID : ''}/>
                    <br />
                    <label htmlFor="numero">Numero de Identificación</label>
                    <input className="form-control" type="text" name="numero" id="numero" onChange={this.handleChange} value = {form ? form.numero : ''}/>
                    <br />
                    <label htmlFor="primerNombre">Primer Nombre</label>
                    <input className="form-control" type="text" name="primerNombre" id="primerNombre" onChange={this.handleChange} value = {form ? form.primerNombre : ''}/>
                    <br />
                    <label htmlFor="otroNombre">Segundo Nombre</label>
                    <input className="form-control" type="text" name="otroNombre" id="otroNombre" onChange={this.handleChange} value = {form ? form.otroNombre : ''}/>
                    <br />
                    <label htmlFor="primerApellido">Primer Apellido</label>
                    <input className="form-control" type="text" name="primerApellido" id="primerApellido" onChange={this.handleChange} value = {form ? form.primerApellido : ''}/>
                    <br />
                    <label htmlFor="segundoApellido">Segundo Apellido</label>
                    <input className="form-control" type="text" name="segundoApellido" id="segundoApellido" onChange={this.handleChange} value = {form ? form.segundoApellido : ''} />
                    <br />
                    <label htmlFor="pais">País de Operación</label>
                    <input className="form-control" type="text" name="pais" id="pais" onChange={this.handleChange} value = {form ? form.pais : ''}/>
                    <br />
                    <label htmlFor="area">Área</label>
                    <input className="form-control" type="text" name="area" id="area" onChange={this.handleChange} value = {form ? form.area : ''}/>
                    <br />
                    <label htmlFor="area">Fecha de Ingreso</label>
                    <input  type="date" id="fechaDeIngreso" name="fechaDeIngreso"
                            value= {form ? form.fechaDeIngreso : hoy}
                            min={mesAnteriorFinal(hoy)} max={hoy} onChange={this.handleChange} 
                    >              
                    </input>
                    <br />
                  </div>
                </ModalBody>

                <ModalFooter>
          { this.state.tipoModal === 'insertar' ?
                    <button className="btn btn-success" onClick = {this.peticionPost}>
                    Insertar
                  </button> :
                  <button className="btn btn-success" onClick = {this.peticionPut} >
                  Actualizar
                 </button>
          }
  
                    <button className="btn btn-danger" onClick = {()=>this.modalInsertar()}>Cancelar</button>
                </ModalFooter>
    </Modal>

    <Modal isOpen={this.state.modalEliminar}>
            <ModalBody>
               Estás seguro que deseas eliminar al usuario? {form && (form.primerNombre + " " + form.primerApellido)}
            </ModalBody>
            <ModalFooter>
              <button className="btn btn-danger" onClick={()=>this.peticionDelete()}>Sí</button>
              <button className="btn btn-secundary" onClick={()=>this.setState({modalEliminar: false})}>No</button>
            </ModalFooter>
    </Modal>

  <button className="btn btn-primary btn-lg btn-block" onClick = {()=> {
    const paginado = this.state.paginadoFinal + 5
    this.peticionesGetPaginado(this.state.paginadoInicial,paginado);
    this.setState({paginadoFinal: paginado})
  }}>
                    Ver mas usuarios
   </button>

  

  </div>

          

  )
  ;
  }
}

export default App;


/***
 * 
 *  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      {
        this.state.cantidadUsers.map((each) => {
          return (
            <li class="page-item" onClick = {()=> {
              const paginado = this.state.paginadoFinal + 5
              this.peticionesGetPaginado(this.state.paginadoInicial,paginado);
              this.setState({paginadoFinal: paginado})
            }}><a class="page-link" href="#">{`${each}`}</a></li>
          )
        })
      }
    </ul>
  </nav>
 */
