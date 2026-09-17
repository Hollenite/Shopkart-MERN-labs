import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await getMe();
        setCustomer(response.data.customer || response.data);
      } catch (requestError) {
        if (requestError.response?.status === 401 || requestError.response?.status === 403) {
          navigate("/login", { replace: true });
        } else {
          setError("Unable to load customer details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [navigate]);

  if (loading) return <p className="p-6">Loading your profile...</p>;
  if (error) return <p className="p-6">{error}</p>;

  return (
    <main className="shop-main">
      <h1>Welcome back, {customer.fullName}.</h1>
      <p>{customer.email}</p>
      <p>{customer.phone}</p>
    </main>
  );
}

export default Home;
