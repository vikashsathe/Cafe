import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const [tables, setTables] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/tables")
      .then(res => setTables(res.data));
  }, []);

  return (
    <div>
      <h2>Welcome to Cafe ☕</h2>
      <p>Total Tables: {tables.length}</p>
    </div>
  );
};

export default Home;