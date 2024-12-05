//MODULI
import { useState, useEffect } from "react";
import "./assets/css/App.css";

//FUNZIONI
const getNextId = (list) => {
  //id di default
  let lastId = 1;

  const idList = list.map((item) => item.id);

  while (idList.includes(lastId)) {
    lastId++;
  }

  console.log(lastId);

  return lastId;
};

const getBadgeColor = (category) => {
  switch (category.toLowerCase()) {
    case "music":
      return "bg-yellow";
    case "news":
      return "bg-red";
    case "gaming":
      return "bg-green";
    case "sport":
      return "bg-cyan";
    case "politics":
      return "bg-orange";
    default:
      return "";
  }
};

//stato di default del form
const initialFormData = {
  title: "",
  content: "",
  image: "",
  category: "sport",
  published: true,
};

function App() {
  //variabili reattive
  const [items, setItems] = useState([]);
  const [articleFormData, setArticleFormData] = useState(initialFormData);

  //funzioni di richiesta
  const getData = () => {
    fetch("http://localhost:3000")
      .then((res) => res.json())
      .then((data) => {
        setItems(data.posts);
      });
  };

  useEffect(getData, []);

  const deleteData = (id) => {
    fetch("http://localhost:3000/" + id, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(`l'oggetti con id ${data.id} è stato eliminato`);
      });
  };

  //HANDLERS
  function handleArticleFormData(e) {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;

    setArticleFormData((formData) => ({
      ...formData,
      [e.target.name]: value,
    }));
  }

  const handleFormSubmit = (e) => {
    const { title, content, image, published, category } = articleFormData;

    if (!title || !content) {
      alert("Sono presenti dei campi non compilati");
      return;
    }
    //impedisce che venga ricaricata la pagina ogni volta avvenga l'evento
    e.preventDefault();
    //creo una nuova lista che conterrà quella vecchia + l'oggetto nuovo
    const newList = [...items];
    newList.push({
      id: getNextId([...items]),
      title: title,
      content: content,
      image: image,
      published: published,
      category: category,
    });

    setItems(newList);

    setArticleFormData(initialFormData);
  };

  // const handleListItemClick = (id) => {
  //   //setto la lista ad una nuova lista che filtra per tutto tranne l'oggetto da eliminare
  //   const cleanList = items.filter((item) => item.id !== id);
  //   setItems(cleanList);
  //   deleteData(id);
  // };

  //DOM
  return (
    <div className="wrapper">
      <form onSubmit={handleFormSubmit} className="form-container">
        <br />
        <input
          type="text"
          id="article-title"
          name="title"
          value={articleFormData.title}
          onChange={handleArticleFormData}
          placeholder="Titolo"
        />
        <br />
        <input
          type="text"
          id="article-content"
          name="content"
          value={articleFormData.content}
          onChange={handleArticleFormData}
          placeholder="Contenuto"
        />
        <br />
        <input
          type="text"
          id="article-image"
          name="image"
          value={articleFormData.image}
          onChange={handleArticleFormData}
          placeholder="Immagine"
        />
        <br />
        <select
          name="category"
          id="category"
          value={articleFormData.category}
          onChange={handleArticleFormData}
        >
          <option value="music">Musica</option>
          <option value="news">News</option>
          <option value="gaming">Gaming</option>
          <option value="sport">Sport</option>
          <option value="politics">Politica</option>
        </select>
        <br />
        <div>
          <input
            type="checkbox"
            checked={articleFormData.published}
            onChange={handleArticleFormData}
            name="published"
          />
          <label htmlFor="article-state">Pubblica</label>
        </div>
        <br /> <br />
        <button type="submit">Invia</button>
      </form>
      <br></br>
      <hr></hr>
      <p className="opaque">Clicca gli articoli per eliminarli</p>
      <div className="article-container">
        {items.map((item) => (
          <div
            //controllo se l'oggetto è pubblicato altrimenti gli assegno display none
            className={`list-item-container${
              item.published === false ? " inactive" : ""
            }`}
            key={item.id}
            onClick={() => deleteData(id)}
          >
            <img src={item.image || "https://placehold.co/600x400"} />
            <p className="item-title">
              <b>{item.title}</b>
            </p>
            <p>{item.content}</p>
            <div className="list-item-description">
              <p>Id : {item.id}</p>
              <span
                className={`list-item-badge ${getBadgeColor(item.category)}`}
              >
                {item.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
