//-------------------------------------------------------------------------------------------------------//
const express = require("express");
const app = express();
const {Router} = express;
//-------------------------------------------------------------------------------------------------------//
const routerProductos = new Router();
const routerCarrito = new Router();
app.use("/api/productos", routerProductos);
app.use("/api/carrito", routerCarrito);

const {getAll, getById, addProductToFile, addCartToFile, addProductsToCart,deleteProductFromCart, changeById, deleteById} = require("../Api/apiComerce")

const PORT = 8080;
app.listen(PORT, () => {
  console.log("servidor escuchando en el " + PORT);
});

const isAdmin = true;
//-------------------------------------------------------------------------------------------------------//
//Metodos para el listado de productos
//-------------------------------------------------------------------------------------------------------//
//Mostrar todos los productos
routerProductos.get("/", (req, res) => {
  getAll("../Files/productos.json").then((data) => {
    res.json(data);
  });
});


//Mostrar producto por ID
routerProductos.get("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  getById(id, "../Files/productos.json").then((data) => {
    if(data){
      res.json(data);
    }else{
      res.json({error:404, descripcion:"No se encontro un producto con ese ID."})
    }
    
  });
});


//Agregar un producto(SOLO PARA ADMINISTRADORES)
const productToAdd = {
  nombre: "PokeBall",
  codigo: "Y935Z",
  fotoUrl: "https://cdn4.iconfinder.com/data/icons/pokemon-go-5/100/9-512.png",
  precio: 5000,
  stock: 10,
};

if (isAdmin) {
  routerProductos.post("/", (req, res) => {
    addProductToFile(productToAdd, "../Files/productos.json").then((data) => {
      res.json(data);
    });
  });
} else {
  routerProductos.post("/", (req, res) => {
    res.json({error:401, descripcion:"No tienes los permisos nesesarios para hacer esto"});
  });
}


//Cambiar o actualizar un producto(SOLO PARA ADMINISTRADORES)
const productToChange = {
  timeStamp: "1/12/2022 12:01",
  nombre: "MasterBall",
  codigo: "53OS0",
  fotoUrl: "https://cdn4.iconfinder.com/data/icons/pokemon-go-5/100/9-512.png",
  precio: 9999,
  stock: 10,
};
if (isAdmin) {
  routerProductos.put("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    changeById(id, "../Files/productos.json", productToChange).then((data) => {
      if(data){
        res.json(data);
      }else{
        res.json({error:404, descripcion:"No se encontro un producto con ese ID."})
      }
      
    });
  });
} else {
  routerProductos.put("/:id", (req, res) => {
    res.json({error:401, descripcion:"No tienes los permisos nesesarios para hacer esto"});
  });
}


//Eliminar un producto por su id(SOLO PARA ADMINISTRADORES)
if (isAdmin) {
  routerProductos.delete("/:id", (req, res) => {
    const id = parseInt(req.params.id);
    deleteById(id, "../Files/productos.json").then((data) => {
      if(data){
        res.json(data);
      }else{
        res.json({error:404, descripcion:"No se encontro un producto con ese ID."});
      }
      
    });
  });
} else {
  routerProductos.delete("/:id", (req, res) => {
    res.json({error:401, descripcion:"No tienes los permisos nesesarios para hacer esto"});
  });
}

//-------------------------------------------------------------------------------------------------------//
//Metodos para el carrito
//-------------------------------------------------------------------------------------------------------//
//Crea un carrito nuevo y devuelve su id
routerCarrito.post("/", (req, res) => {
  addCartToFile("../Files/carrito.json").then((data) => {
    res.json(data);
  });
});

//Elimina un carrito existente
routerCarrito.delete("/:id", (req, res) => {
  const id = parseInt(req.params.id);
  deleteById(id, "../Files/carrito.json").then((data) => {
    if(data){
      res.json(data);
    }else{
      res.json({error:404, descripcion:"No se encontro un carrito con ese ID."})
    }
    
  });
});

//Muestra los productos adentro de un carrito seleccionado por su id
routerCarrito.get("/:id/productos", (req, res) => {
  const id = parseInt(req.params.id);
  getById(id, "../Files/carrito.json").then((data) => {
    if (data) {
      res.json(data.productos);
    } else {
      res.json({error:404, descripcion:"No se encontro un carrito con ese ID."});
    }
  });
});

//Agrega productos a un carrito, ambos seleccionados por su id
routerCarrito.post("/:id/productos/:id_Prod", (req, res) => {
  const id = parseInt(req.params.id);
  const idProducto = parseInt(req.params.id_Prod);
  addProductsToCart(
    "../Files/productos.json",
    idProducto,
    "../Files/carrito.json",
    id
  ).then((data) => {
    if(data){
      res.json(data);
    }else{
      res.json({error:404, descripcion:"El ID de carrito o de producto son erroneos."})
    }
    
  });
});

//elimina un producto seleccionado por id del carrito
routerCarrito.delete("/:id/productos/:id_Prod", (req, res) => {
  const id = parseInt(req.params.id);
  const idProducto = parseInt(req.params.id_Prod);
  deleteProductFromCart("../Files/carrito.json", id, idProducto).then(data => {
    if(data){
      res.json(data);
    }else{
      res.json({error:404, descripcion:"El ID de carrito o de producto son erroneos."});
    }
    
  })

});

//-------------------------------------------------------------------------------------------------------//
//En caso de requerir una ruta que no exista.
//-------------------------------------------------------------------------------------------------------//
app.get("*", (req, res) => {
    res.json({error:404, descripcion:"Ruta GET no implementada"});
});
app.post("*", (req, res) => {
  res.json({error:404, descripcion:"Ruta POST no implementada"});
});
app.put("*", (req, res) => {
  res.json({error:404, descripcion:"Ruta PUT no implementada"});
});
app.delete("*", (req, res) => {
  res.json({error:404, descripcion:"Ruta DELETE no implementada"});
});

//-------------------------------------------------------------------------------------------------------//