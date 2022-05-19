import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import axios from 'axios';

function App() {
  const baseUrl="http://localhost/apicamila/";
  const [data, setData]=useState([]);
  const [modalInsertar, setModalInsertar]= useState(false);
  const [modalEditar, setModalEditar]= useState(false);
  const [modalEliminar, setModalEliminar]= useState(false);
  const [frameworkSeleccionado, setFrameworkSeleccionado]=useState({
    id: '',
    producto: '',
    lugar: '',
    horario: '',
    tipodemasaje: '',
  });

  const handleChange=e=>{
    const {name, value}=e.target;
    setFrameworkSeleccionado((prevState)=>({
      ...prevState,
      [name]: value
    }))
    console.log(frameworkSeleccionado);
  }

  const abrirCerrarModalInsertar=()=>{
    setModalInsertar(!modalInsertar);
  }

  const abrirCerrarModalEditar=()=>{
    setModalEditar(!modalEditar);
  }

  const abrirCerrarModalEliminar=()=>{
    setModalEliminar(!modalEliminar);
  }

  const peticionGet=async()=>{
    await axios.get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPost=async()=>{
    var f = new FormData();
    f.append("producto", frameworkSeleccionado.producto);
    f.append("lugar", frameworkSeleccionado.lugar);
    f.append("horario", frameworkSeleccionado.horario);
    f.append("tipodemasaje", frameworkSeleccionado.tipodemasaje);
    f.append("METHOD", "POST");
    await axios.post(baseUrl, f)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionPut=async()=>{
    var f = new FormData();
    f.append("producto", frameworkSeleccionado.producto);
    f.append("lugar", frameworkSeleccionado.lugar);
    f.append("horario", frameworkSeleccionado.horario);
    f.append("tipodemasaje", frameworkSeleccionado.tipodemasaje);
    f.append("METHOD", "PUT");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      var dataNueva= data;
      dataNueva.map(framework=>{
        if(framework.id===frameworkSeleccionado.id){
          framework.producto=frameworkSeleccionado.producto;
          framework.lugar=frameworkSeleccionado.lugar;
          framework.horario=frameworkSeleccionado.horario;
          framework.tipodemasaje=frameworkSeleccionado.tipodemasaje;
        }
      });
      setData(dataNueva);
      abrirCerrarModalEditar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const peticionDelete=async()=>{
    var f = new FormData();
    f.append("METHOD", "DELETE");
    await axios.post(baseUrl, f, {params: {id: frameworkSeleccionado.id}})
    .then(response=>{
      setData(data.filter(framework=>framework.id!==frameworkSeleccionado.id));
      abrirCerrarModalEliminar();
    }).catch(error=>{
      console.log(error);
    })
  }

  const seleccionarFramework=(framework, caso)=>{
    setFrameworkSeleccionado(framework);

    (caso==="Editar")?
    abrirCerrarModalEditar():
    abrirCerrarModalEliminar()
  }

  useEffect(()=>{
    peticionGet();
  },[])

  return (
<div style={{textAlign: 'center'}}>
<br/>
      <button className="btn btn-success" onClick={()=>abrirCerrarModalInsertar()}>Insertar</button>
      <br /><br />
    <table className="table table-striped">
      <thead>
        <tr>
          <th>ID</th>
          <th>Producto</th>
          <th>Lugar</th>
          <th>Horario</th>
          <th>Tipodemasaje</th>
        </tr>
      </thead>
      <tbody>
        {data.map(framework=>(
          <tr key={framework.id}>
            <td>{framework.id}</td>
            <td>{framework.producto}</td>
            <td>{framework.lugar}</td>
            <td>{framework.horario}</td>
            <td>{framework.tipodemasaje}</td>
          <td>
          <button className="btn btn-primary" onClick={()=>seleccionarFramework(framework, "Editar")}>Editar</button> {"  "}
          <button className="btn btn-danger" onClick={()=>seleccionarFramework(framework, "Eliminar")}>Eliminar</button>
          </td>
          </tr>
        ))}

      </tbody> 

    </table>

    <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Framework</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Producto: </label>
          <br />
          <input type="text" className="form-control" name="producto" onChange={handleChange}/>
          <br />
          <label>Lugar: </label>
          <br />
          <input type="text" className="form-control" name="lugar" onChange={handleChange}/>
          <br />
          <label>Horario: </label>
          <br />
          <input type="text" className="form-control" name="horario" onChange={handleChange}/>
          <br />
          <label>Tipodemasaje: </label>
          <br />
          <input type="text" className="form-control" name="tipo de masaje" onChange={handleChange}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPost()}>Insertar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>Cancelar</button>
      </ModalFooter>
    </Modal>
    
    <Modal isOpen={modalEditar}>
      <ModalHeader>Editar Framework</ModalHeader>
      <ModalBody>
        <div className="form-group">
          <label>Producto: </label>
          <br />
          <input type="text" className="form-control" name="producto" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.producto}/>
          <br />
          <label>Lugar: </label>
          <br />
          <input type="text" className="form-control" name="lugar" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.lugar}/>
          <br />
          <label>Horario: </label>
          <br />
          <input type="text" className="form-control" name="horario" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.horario}/>
          <br />
          <label>Tipodemasaje: </label>
          <input type="text" className="form-control" name="tipodemasaje" onChange={handleChange} value={frameworkSeleccionado && frameworkSeleccionado.tipodemasaje}/>
          <br />
        </div>
      </ModalBody>
      <ModalFooter>
        <button className="btn btn-primary" onClick={()=>peticionPut()}>Editar</button>{"   "}
        <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>Cancelar</button>
      </ModalFooter>
    </Modal>

    <Modal isOpen={modalEliminar}>
        <ModalBody>
        ¿Estás seguro que deseas eliminar el Framework {frameworkSeleccionado && frameworkSeleccionado.producto}?
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-danger" onClick={()=>peticionDelete()}>
            Sí
          </button>
          <button
            className="btn btn-secondary"
            onClick={()=>abrirCerrarModalEliminar()}
          >
            No
          </button>
        </ModalFooter>
      </Modal>

    </div>
  );
}

export default App;

