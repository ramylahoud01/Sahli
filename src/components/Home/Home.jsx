import { Outlet, redirect } from "react-router-dom";
import Layout from "./Layout";

const Home = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default Home;

export function rootLoader() {
  return redirect("/swap");
}
