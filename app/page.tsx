import Header from "./components/Header";
import HomeClient from "./components/HomeClient";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <HomeClient />
      </main>
    </div>
  );
}
