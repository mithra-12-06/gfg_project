import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { source_code, language_id, stdin } = await req.json();

    const JUDGE0_API_KEY = Deno.env.get("JUDGE0_API_KEY");
    const JUDGE0_URL = Deno.env.get("JUDGE0_URL") || "https://judge0-ce.p.rapidapi.com";

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (JUDGE0_API_KEY) {
      headers["X-RapidAPI-Key"] = JUDGE0_API_KEY;
      headers["X-RapidAPI-Host"] = "judge0-ce.p.rapidapi.com";
    }

    // Create submission
    const createRes = await fetch(`${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`, {
      method: "POST",
      headers,
      body: JSON.stringify({ source_code, language_id, stdin: stdin || "" }),
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      // Fallback: simulate execution if Judge0 is unavailable
      console.error("Judge0 error:", createRes.status, errText);
      return new Response(JSON.stringify({
        output: simulateExecution(source_code, language_id),
        execution_time: "0.02s",
        simulated: true,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = await createRes.json();
    const output = result.stdout || result.stderr || result.compile_output || "No output";
    const error = result.status?.id > 3 ? (result.stderr || result.compile_output || result.status?.description) : null;

    return new Response(JSON.stringify({
      output: error || output,
      execution_time: result.time ? `${result.time}s` : "N/A",
      status: result.status?.description,
      error: error || null,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error("run-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

function simulateExecution(code: string, languageId: number): string {
  // Simple simulation for when Judge0 is unavailable
  if (code.includes("print")) {
    const match = code.match(/print\s*\(\s*['"](.*?)['"]\s*\)/);
    if (match) return match[1];
  }
  if (code.includes("console.log")) {
    const match = code.match(/console\.log\s*\(\s*['"](.*?)['"]\s*\)/);
    if (match) return match[1];
  }
  if (code.includes("printf")) {
    const match = code.match(/printf\s*\(\s*['"](.*?)['"]/);
    if (match) return match[1];
  }
  return "Program executed successfully (simulated)";
}
