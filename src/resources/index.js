module.exports = {
    tipoID: ['CC','CE','PP','PE' ],
    pais : ['CO','US'],
    area : ['Administracion', 'Financiera', 'Compras', 'Infraestructura','Desarrollo', 'Operacion', 'Talento Humano', 'Servicios Varios'],
    formSh : {
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
     url :  "https://empleados-cidenet.herokuapp.com/api/users",
     urlSearch : "https://empleados-cidenet.herokuapp.com/api/search"
}

