import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Note from "./Note";
import CreateArea from "./CreateArea";
import axios from "axios";
import env from "react-dotenv";
import ReactPaginate from 'react-paginate';

const baseURL = env.BACKEND_URL;
const itemsPerPage = 10;

function App() {
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [inputs, setInputs] = useState({
    title: "",
    content: ""
  });
  const [isExpanded, setExpanded] = useState(false);


  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = notes.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(notes.length / itemsPerPage);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % notes.length;

    setItemOffset(newOffset);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      fetchData();
    }, 2000);
  }, [])

  const fetchData = async () => {
    await axios.get(baseURL).then((result) => {
      const data = result.data.data;
      setNotes(data);
    }).catch((err) => {
      console.log(err);
    });
  }


  const handleSubmit = async (data) => {
    const newData = {
      title: data.title,
      content: data.content
    }

    const status = validate(data);

    if (!status) {
      if (!isEdit) {
        await axios.post(baseURL + 'todos/create', newData).then((result) => {
          fetchData()
        }).catch((err) => {
          console.log(err);
        });
      } else {
        await axios.patch(baseURL + 'todos/' + data._id, newData).then((result) => {
          fetchData()
          setIsEdit(false);
        }).catch((err) => {
          console.log(err);
        });
      }
    }
    setIsEdit(false);
  }

  const validate = (data) => {
    return !data.title.length > 0 || !data.content.length > 0 ? true : false;
  }

  const handleDelete = async (id) => {
    if (window.confirm("Delete the item?")) {
      await axios.delete(baseURL + 'todos/' + id).then((result) => {
        fetchData();
      }).catch((err) => {
        console.log(err);
      });
    }
  };

  const handleEdit = async (e, id) => {
    await axios.get(baseURL + 'todos/' + id).then((result) => {
      const getTodo = result.data.data;
      setIsEdit(true);
      setInputs(getTodo);
      setExpanded(true);
    }).catch((err) => {
      console.log(err);
    });
  }

  return (
    <div>
      <Header />
      <CreateArea
        onHandle={handleSubmit}
        setInputs={setInputs}
        inputs={inputs}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
        setExpanded={setExpanded}
        isExpanded={isExpanded}
      />
      <div style={{ overflow: "hidden" }}>
        {currentItems?.map((item) => {
          return (
            <Note
              key={item._id}
              onDelete={handleDelete}
              onEdit={handleEdit}
              id={item._id}
              title={item.title}
              content={item.content}
            />
          );
        })}
      </div>
      {loading ? (
         <div className="loader-container">
      	  <div className="spinner"></div>
        </div>
      ) : (notes.length > itemsPerPage && (
        <div className='pagination'>
          <ReactPaginate
            breakLabel="..."
            nextLabel="next >"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="< previous"
            renderOnZeroPageCount={null}
          />
        </div>
      ))}

      <Footer />
    </div >
  );
}

export default App;
