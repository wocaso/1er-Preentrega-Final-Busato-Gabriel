const fs = require("fs");

//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
function makeNewId(data) {
    let i = 0;
    let lastId = 0;
    while (data[i] !== undefined) {
      lastId = data[i].id;
      i++;
    }
    let newId = parseInt(lastId);
    return newId + 1;
  }

  function getDate() {
    let fullDate = new Date();
    let date =
      fullDate.getDate() +
      "/" +
      (fullDate.getMonth() + 1) +
      "/" +
      fullDate.getFullYear() +
      " " +
      fullDate.getHours() +
      ":" +
      (fullDate.getMinutes() >= 10 ?
        fullDate.getMinutes() :
        "0" + fullDate.getMinutes());
    return date;
  }
  
  async function getAll(fileRoute) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      return data;
    } catch (err) {
      console.log("Algo salio mal con el getAll", err);
      return [];
    }
  }
  
  async function getById(id, fileRoute) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let i = 0;
      let dataFound = null;
      while (data[i] !== undefined) {
        data[i].id === id && (dataFound = data[i]);
        i++;
      }
      return dataFound;
    } catch {
      console.log("Algo salio mal con el getById");
    }
  }
  
  async function addProductToFile(objectToAdd, fileRoute) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let newProduct = {
        ...objectToAdd,
        id: makeNewId(data),
        timeStamp: getDate().toString(),
      };
      data.push(newProduct);
      fs.writeFile(fileRoute, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.log("Algo salio mal leyendo el archivo en addProductToFile");
        }
      });
      return data;
    } catch (err) {
      console.log("Algo salio mal con el addProductToFile", err);
      return [];
    }
  }
  
  async function addCartToFile(fileRoute) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let newCart = {
        id: makeNewId(data),
        timeStamp: getDate().toString(),
        productos: [],
      };
      data.push(newCart);
      fs.writeFile(fileRoute, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.log("Algo salio mal leyendo el archivo en addCartToFile");
        }
      });
      return "El id de tu carrito es " + newCart.id;
    } catch (err) {
      console.log("Algo salio mal con el saveObject", err);
      return [];
    }
  }
  
  async function addProductsToCart(productsRoute, productId, cartRoute, cartId) {
    try {
      let product = await getById(productId, productsRoute);
      const contenido = await fs.promises.readFile(cartRoute, "utf-8");
      let data = JSON.parse(contenido);
      let i = 0;
      if (product) {
        let dataSucces = false; 
        while (data[i] !== undefined) {
          if(data[i].id === cartId){
            data[i].productos.push(product);
            dataSucces = true;
          }
          i++;
        }
        if(dataSucces===false){
          return false;
        }
        fs.writeFile(cartRoute, JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.log(
              "Algo salio mal cambiando el producto con addProductsToCart"
            );
          }
        });
        return data;
      } else {
        return false;
      }
    } catch {
      console.log("Algo salio mal con el addProductsToCart");
    }
  }
  async function deleteProductFromCart(fileRoute, cartId, productId) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let i = 0;
      let dataSucces = false; 
      while (data[i] !== undefined) {
        if (data[i].id === cartId) {
          let j = 0;
          while (data[i].productos[j] !== undefined) {
            if(data[i].productos[j].id === productId){
              data[i].productos.splice(j, 1);
              dataSucces = true;
            }
            j++;
          }
        }
        i++;
      }
      if(!dataSucces){
        return false;
      }
      fs.writeFile(fileRoute, JSON.stringify(data, null, 2), (err) => {
        if (err) {
          console.log("Algo salio mal con deleteProductFromCart");
        }
      });
      return data;
    } catch {
      console.log("Algo salio mal con deleteProductFromCart");
    }
  }
  async function changeById(id, fileRoute, newData) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let i = 0;
      let dataSucces = false; 
      while (data[i] !== undefined) {
        if(data[i].id === id){
          data[i] = {
            ...newData,
            id: id
          }
          dataSucces = true;
        }
        i++;
      }
      if(dataSucces){
        fs.writeFile(fileRoute, JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.log("Algo salio mal cambiando el producto con changeById");
          }
        });
        return data;
      }else{
        return false;
      }
      
    } catch {
      console.log("Algo salio mal con el changeById");
    }
  }
  
  async function deleteById(id, fileRoute) {
    try {
      const contenido = await fs.promises.readFile(fileRoute, "utf-8");
      let data = JSON.parse(contenido);
      let i = 0;
      let dataSucces = false; 
      while (data[i] !== undefined) {
        if(data[i].id === id){
          data.splice(i, 1)
          dataSucces = true;
        }
        i++;
      }
      if(dataSucces){
        fs.writeFile(fileRoute, JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.log("Algo salio mal con deleteById");
          }
        });
        return data;
      }
      else{
        return false;
      }
  
    } catch {
      console.log("Algo salio mal con deleteById");
    }
  }
//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
  module.exports = {makeNewId, getAll, getById, addProductToFile, addCartToFile, addProductsToCart,deleteProductFromCart, changeById, deleteById, getDate};
//--------------------------------------------------------------------------------------------------------------------------------------------------------------//


