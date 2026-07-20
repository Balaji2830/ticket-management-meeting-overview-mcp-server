import { Background } from "./components/Background";
import { Navbar } from "./components/Navbar";
import { TicketsSection } from "./components/TicketsSection";
import { MeetingsSection } from "./components/MeetingsSection";

function App() {
  return (
    <>
      <Background />
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Dashboard</h1>
          <p className="mt-2 text-white/50">
            Manage tickets and get a quick overview of meetings, backed live by PostgreSQL.
          </p>
        </div>
        <div className="flex flex-col gap-14">
          <TicketsSection />
          <MeetingsSection />
        </div>
      </main>
    </>
  );
}

export default App;
