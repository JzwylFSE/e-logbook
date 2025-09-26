import { createClientForServer } from "../../../utils/supabase/server";
import { redirect } from "next/navigation";
import SettingsPanel from "@/components/SettingsPanel";
import BackButton from "@/components/BackButton";

export default async function SettingsPage() {
    const supabase = createClientForServer();
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect("/auth")
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single()

    return <SettingsPanel user={user} profile={profile} />
}