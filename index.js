import express from "express"; //*Se importa la biblioteca de express
import fs, { read } from "fs"; //*Importamos el modulo de filesystem de nodejs
import bodyParser from "body-parser"; //*Middleware de nodejs para analizar el cuerpo de la solicitud entrante (JSON) y convertirlo en un objeto js accesible para 'req.body'.

const app = express(); //*Se crea una instancia de express
app.use(bodyParser.json()); //* se activa el bodyParser

/**
 * *Funcion para leer todos los datos del archivo db.json
 * Se llama al metodo de filesystem para leer de manera sincrona el archivo
 * @returns Se retorna el archivo convertido en objeto JSON
 */
const readData = () => {
  try {
    const data = fs.readFileSync("./db.json");
    return JSON.parse(data);
  } catch (error) {
    console.error("El error al leer el archivo es: ", error);
  }
};
/**
 * *Funcion para escribir en el archivo
 * Se usa el metodo sincrono del filesystem para escribir en db.json
 * Se manda en el metodo fs de segundo argumento, el parametro
 * convetido en cadena
 * @param {Object} data Datos para escribir en el archivo
 */
const writeData = (data) => {
  try {
    fs.writeFileSync("./db.json", JSON.stringify(data));
  } catch (error) {
    console.error("El error al leer el archivo es: ", error);
  }
};

/**
 *  *Como crear un endpoint
 * Basicamente se define una ruta HTTP utilizando el metodo GET, y en este caso es
 * la ruta raiz, o sea la URL principal "/".
 * "(req, res)" Es una 'callback' que se ejecuta una vez que se recibe una solicitud GET
 * esta funcion toma dos argumentos, 'request' que representa la solicitud entrante y
 * 'response' que se represena la respeusta HTTP que se manda al cliente.
 * Y por ultimo el '.send' es el metodo del objeto 'response' para enviar una respuesta.
 */
app.get("/", (req, res) => {
  res.send("Bienvenido a la API");
});

//* Endpoint para obtener todos los cursos
app.get("/cursos", (req, res) => {
  //Se obtiene la informacion de la funcion
  const data = readData();
  //Se renderiza la informacion en su propiedad "Cursos"
  res.json(data.Cursos);
});

//*Endpoint con parametro para obtener unicamente un curso
app.get("/cursos/:id", (req, res) => {
  const data = readData(); //Se obtienen todos los datos del archivo db.json
  const id = parseInt(req.params.id); //Se obtiene el id, y se convierte en dato Int
  const curso = data.Cursos.find((curso) => curso.id === id); //La const "curso" obtiene el valor de una busqueda entre los cursos existentes de "data", el curso se encuentra si es igual al id que se recibio como parametro en la ruta URL "/cursos/:id"
  curso ? res.json(curso) : res.send("El curso solicitado no existe"); //Se manda la respuesta al usuario con el curso buscado, si no existe se manda msj
});

//*Endpoint para crear un curso.
//! Sin el middleware bodyParser no funcionaria.
app.post("/cursos", (req, res) => {
  const data = readData(); //Se obtienen todos los cursos existentes
  const body = req.body; //Se obtiene el cuerpo de la request
  const newCurso = {
    //Se crea un objeto del nuevo curso
    id: data.Cursos.length + 1, //Id del curso generado automaticamente
    ...body, //Se añade todo el cuerpo del request al nuevo curso
  };
  data.Cursos.push(newCurso); //Se empuja el nuevo curso dentro de los cursos existentes
  writeData(data); //Se reescribe el archivo con el nuevo curso.
});

//* Actualizar un curso
app.put("/cursos/:id", (req, res) => {
  const data = readData(); //Se obtienen todos los cursos existentes
  const body = req.body; //Se obtiene el cuerpo de la request
  const id = parseInt(req.params.id); //Se obtiene el id, y se convierte en dato Int
  const cursoIndex = data.Cursos.findIndex((curso) => curso.id === id); //La const "cursoIndex" obtiene el valor de una busqueda del index entre los cursos existentes de "data", el curso se encuentra si es igual al id que se recibio como parametro en la ruta URL "/cursos/:id"
  data.Cursos[cursoIndex] = {
    //hacemos referencia al curso que deseamos actualizar con la posicion: "cursoIndex"
    ...data.Cursos[cursoIndex], //Se hace una copia exacta de las propiedades para asegurar que las propiedes del curso se mantengan excepto las que se desean cambiar
    ...body, //Se toman las propiedades del body que contiene la solicitud de actualizacion y sobreescribibe el curso
  };
  writeData(data);
  res.json({ message: "Curso actualizado" });
});

//*Eliminar un curso
app.delete("/cursos/:id", (req, res) => {
  const data = readData(); //Se obtienen todos los cursos existentes
  const id = parseInt(req.params.id); //Se obtiene el id, y se convierte en dato Int
  const cursoIndex = data.Cursos.findIndex((curso) => curso.id === id); //La const "cursoIndex" obtiene el valor de una busqueda del index entre los cursos existentes de "data", el curso se encuentra si es igual al id que se recibio como parametro en la ruta URL "/cursos/:id"
  data.Cursos.splice(cursoIndex, 1); //Se usa el metodo splice para eliminar desde la posicion "cursoIndex" y "1" indicando los elementos a eliminar
  writeData(data);
  res.json({ mesasge: "El curso ha sido eliminado" });
});

//Se escucha el puerto
app.listen(3000, () => {
  console.log("El servidor esta escuchando en el puerto 3000s");
});
