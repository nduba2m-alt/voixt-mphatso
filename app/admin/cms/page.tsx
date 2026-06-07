import { createServiceClient } from "@/lib/supabase/server";
import CmsEditor from "./cms-editor";

export default async function CmsPage() {
  const supabase = await createServiceClient();
  const { data } = await supabase.from("cms_content").select("*").order("key");
  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl" style={{ color: "#F5F0E8" }}>CONTENT EDITOR</h1>
      <CmsEditor initialContent={data ?? []} />
    </div>
  );
}
