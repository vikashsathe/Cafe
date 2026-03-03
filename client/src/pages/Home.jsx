import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div>
        <h2>Welcome to Cafe ☕</h2>
        <p>Scan your table QR to order.</p>

        <Link to="/order?tableId=T2">
          Go to Table 1
        </Link>
      </div>
    </>
  );
};

export default Home;