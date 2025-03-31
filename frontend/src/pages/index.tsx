import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNotes } from "../store/useNotes";

// MDEditor must be dynamically imported to prevent SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Home() {
  const { notes, addNote } = useNotes();
  const [content, setContent] = useState<string>("");
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSummarize = async () => {
    if (!content.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/summarize", {
        content,
      });
      const newNote = {
        id: Date.now().toString(),
        content,
        summary: res.data.summary,
      };
      addNote(newNote);
      setSummary(res.data.summary);
    } catch (err) {
      console.error("Summarization error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>AI Notes</title>
      </Head>

      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">🧠 AI Notes</h1>

        <MDEditor value={content} onChange={(val) => setContent(val || "")} />

        <div className="mt-4 flex gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded"
            onClick={handleSummarize}
            disabled={loading}
          >
            {loading ? "Summarizing..." : "Summarize Note"}
          </button>
        </div>

        {summary && (
          <div className="mt-6 p-4 border rounded bg-gray-100">
            <h2 className="text-lg font-semibold mb-2">Summary</h2>
            <p>{summary}</p>
          </div>
        )}

        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">🗂 Previous Notes</h2>
          {notes.map((note) => (
            <div key={note.id} className="mb-4 border-b pb-2">
              <p className="text-sm text-gray-500">Original:</p>
              <p className="mb-2">{note.content}</p>
              {note.summary && (
                <>
                  <p className="text-sm text-gray-500">Summary:</p>
                  <p>{note.summary}</p>
                </>
              )}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

