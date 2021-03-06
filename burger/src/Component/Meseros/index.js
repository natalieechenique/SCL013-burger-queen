// Dependencies
import React, { Component } from "react";
import "../Global/Css/Meseros.css";
import Itemenu from "../ItemMenu/itemMenu";
import Executingorder from "../ItemMenu/Executingorder";
import InputContainer from "../ItemMenu/InputContainer";
import Total from "../ItemMenu/Total";
import db from "../../configDB/firebase";

class Meseros extends Component {
// Parte vacio
  state = {
    nfactura: "",
    client: "",
    table: "",
    order: [],
    total: 0,
    status:'',
    time:''
  };

  // Cliente
nameClient(Name) {
  this.setState({
    client: Name
  });
}

// Mesa
numTable(tableNumber) {
  this.setState({
    table: tableNumber
  });
}

  // Agregar items al pedido
  addItem = (item) =>{
    this.setState(e => ({
      order: [...e.order, item],
    }));

  };

  // Elimina item del pedido
   deleteItem = i => {
    let order = [...this.state.order];
    order.splice(i, 1);
    this.setState({
      order: order
    });
  };

  resetOrder() {
    document.getElementById("clientName").value = '';
    document.getElementById("clientTable").value = '';
    this.setState({
      client: "",
      table: "",
      order: []
    });
  }

   // Time
time() {
  this.setState({
    time:''
  });
}

  //Función que guarda los datos de la colección en firebase
  sendOrder() {
    db.collection('orders').add({
      nfactura: '',
      tipofac: 'factura',
      client: this.state.client,
      table: this.state.table,
      order: this.state.order,
      time: new Date(),
      status: 'espera',
    })
    .then((doc) => {
      console.log(doc);
      console.log('Documento guardado exitosamente');
      this.resetOrder();
    })
    .catch((error) => {
      console.log('Error al enviar ', error);
    });
  };

  render() {
    // Se crea const precios y let total con su funcion para sumar
    const precios = this.state.order.map((item) => item.price);
    let total = precios.reduce((a, b) => a + b, 0);

    return (
      <div className="Meseros">
      <div className="Menus">
        <h2>Menus del Día</h2>
         <Itemenu addItem={this.addItem.bind(this)}/>
        </div>
        <div className="Agregar">
          <InputContainer
          nameClient={this.nameClient.bind(this)}
          numTable={this.numTable.bind(this)} />
          <div className='ExecutingorderAndTotal'>
          <Executingorder
          totalItem={this.state.order}
          deleteItem={this.deleteItem.bind(this)} />
          <Total
          total={total}
          sendOrder={this.sendOrder.bind(this)}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Meseros;
