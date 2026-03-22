import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { AdminLogItem } from "@/types/auth";

export default function AdminLogs() {
  const [logs, setLogs] = useState<AdminLogItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true);
      try {
        const response = await api.getAdminLogs(page, 20);
        setLogs(response.logs);
        setTotalPages(response.pagination.totalPages);
      } finally {
        setLoading(false);
      }
    };

    void loadLogs();
  }, [page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 font-mono text-xs uppercase tracking-wider text-muted-foreground">// Admin Logs</h1>

      <div className="rounded-lg border border-border bg-card">
        <div className="grid grid-cols-12 border-b border-border px-4 py-3 text-xs uppercase tracking-wider text-muted-foreground">
          <span className="col-span-2">Time</span>
          <span className="col-span-2">Action</span>
          <span className="col-span-3">Performed By</span>
          <span className="col-span-3">Target</span>
          <span className="col-span-2">Details</span>
        </div>

        {loading ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted-foreground">No logs yet.</p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="grid grid-cols-12 items-center border-b border-border px-4 py-3 text-sm last:border-b-0"
            >
              <span className="col-span-2 text-xs text-muted-foreground">
                {new Date(log.createdAt).toLocaleString()}
              </span>
              <span className="col-span-2 text-foreground">{log.action}</span>
              <span className="col-span-3 text-muted-foreground">
                {log.performedBy?.name || "Admin"} ({log.performedBy?.email || "N/A"})
              </span>
              <span className="col-span-3 text-muted-foreground">{log.targetEmail || "N/A"}</span>
              <span className="col-span-2 text-xs text-muted-foreground">{log.meta || "-"}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          className="rounded border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-xs text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          className="rounded border border-border px-3 py-1.5 text-xs text-foreground disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
